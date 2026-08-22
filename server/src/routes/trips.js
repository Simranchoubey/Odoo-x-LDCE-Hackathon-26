import { Router } from 'express';
import crypto from 'node:crypto';
import { prisma } from '../lib/prisma.js';

const router = Router();

const tripInclude = {
  stops: {
    orderBy: { sortOrder: 'asc' },
    include: {
      city: true,
      items: { orderBy: [{ date: 'asc' }, { time: 'asc' }], include: { activity: true } },
    },
  },
};

const day = (d) => (d ? new Date(d).toISOString().slice(0, 10) : null);

function serializeItem(i) {
  return {
    id: i.id,
    name: i.title,
    expense: i.cost,
    time: i.time,
    date: day(i.date),
    category: i.category,
    activityId: i.activityId,
  };
}

function serializeStop(s) {
  return {
    id: s.id,
    title: s.title || `${s.city.name}`,
    description: '',
    startDate: day(s.arrivalDate),
    endDate: day(s.departureDate),
    budget: s.budget,
    sortOrder: s.sortOrder,
    city: { id: s.city.id, name: s.city.name, country: s.city.country, image: s.city.imageUrl },
    activities: s.items.map(serializeItem),
  };
}

function serializeTrip(t, spent) {
  const firstCity = t.stops?.[0]?.city;
  return {
    id: t.id,
    name: t.name,
    destination: firstCity ? `${firstCity.name}, ${firstCity.country}` : '',
    image: t.coverImage || firstCity?.imageUrl || null,
    startDate: day(t.startDate),
    endDate: day(t.endDate),
    status: t.status,
    description: t.description || '',
    budget: { total: t.totalBudget, spent, currency: t.currency },
    tags: [],
    isPublic: t.isPublic,
    shareSlug: t.shareSlug,
    sections: (t.stops || []).map(serializeStop),
  };
}

function computeSpent(trip) {
  return trip.stops.reduce(
    (sum, s) => sum + s.items.reduce((a, i) => a + i.cost, 0),
    0
  );
}

async function findOwnedTrip(req, res) {
  const trip = await prisma.trip.findUnique({
    where: { id: req.params.id },
    include: tripInclude,
  });
  if (!trip || trip.userId !== req.user.id) {
    res.status(404).json({ error: 'Trip not found' });
    return null;
  }
  return trip;
}

const parseDate = (v) => new Date(v);

// ---------- trips ----------

router.get('/', async (req, res, next) => {
  try {
    const trips = await prisma.trip.findMany({
      where: { userId: req.user.id },
      include: tripInclude,
      orderBy: { createdAt: 'desc' },
    });
    res.json(trips.map((t) => serializeTrip(t, computeSpent(t))));
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, description, startDate, endDate, coverImage, totalBudget, currency } = req.body || {};
    if (!name || !startDate || !endDate) {
      return res.status(400).json({ error: 'Name, start date and end date are required' });
    }
    if (parseDate(endDate) < parseDate(startDate)) {
      return res.status(400).json({ error: 'End date must be on or after start date' });
    }
    const trip = await prisma.trip.create({
      data: {
        userId: req.user.id,
        name,
        description,
        coverImage,
        totalBudget: Number(totalBudget) || 0,
        currency: currency || 'USD',
        startDate: parseDate(startDate),
        endDate: parseDate(endDate),
      },
      include: tripInclude,
    });
    res.status(201).json(serializeTrip(trip, 0));
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const trip = await findOwnedTrip(req, res);
    if (trip) res.json(serializeTrip(trip, computeSpent(trip)));
  } catch (err) { next(err); }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const existing = await findOwnedTrip(req, res);
    if (!existing) return;
    const allowed = ['name', 'description', 'coverImage', 'status'];
    const data = {};
    for (const key of allowed) if (req.body?.[key] !== undefined) data[key] = req.body[key];
    if (req.body?.totalBudget !== undefined) data.totalBudget = Number(req.body.totalBudget) || 0;
    if (req.body?.startDate) data.startDate = parseDate(req.body.startDate);
    if (req.body?.endDate) data.endDate = parseDate(req.body.endDate);
    const trip = await prisma.trip.update({ where: { id: existing.id }, data, include: tripInclude });
    res.json(serializeTrip(trip, computeSpent(trip)));
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const existing = await findOwnedTrip(req, res);
    if (!existing) return;
    await prisma.trip.delete({ where: { id: existing.id } });
    res.status(204).end();
  } catch (err) { next(err); }
});

// ---------- stops ----------

router.post('/:id/stops', async (req, res, next) => {
  try {
    const trip = await findOwnedTrip(req, res);
    if (!trip) return;
    const { cityId, arrivalDate, departureDate, title } = req.body || {};
    if (!cityId || !arrivalDate || !departureDate) {
      return res.status(400).json({ error: 'City, arrival date and departure date are required' });
    }
    const city = await prisma.city.findUnique({ where: { id: cityId } });
    if (!city) return res.status(404).json({ error: 'City not found' });
    const stop = await prisma.stop.create({
      data: {
        tripId: trip.id,
        cityId,
        title,
        arrivalDate: parseDate(arrivalDate),
        departureDate: parseDate(departureDate),
        budget: Number(req.body?.budget) || 0,
        sortOrder: trip.stops.length,
      },
    });
    res.status(201).json(stop);
  } catch (err) { next(err); }
});

router.patch('/:id/stops/order', async (req, res, next) => {
  try {
    const trip = await findOwnedTrip(req, res);
    if (!trip) return;
    const { stopIds = [] } = req.body || {};
    const owned = new Set(trip.stops.map((s) => s.id));
    if (!stopIds.length || !stopIds.every((id) => owned.has(id))) {
      return res.status(400).json({ error: 'stopIds must reference stops of this trip' });
    }
    await prisma.$transaction(
      stopIds.map((id, index) =>
        prisma.stop.update({ where: { id }, data: { sortOrder: index } })
      )
    );
    res.json({ ok: true });
  } catch (err) { next(err); }
});

router.patch('/stops/:stopId', async (req, res, next) => {
  try {
    const stop = await prisma.stop.findUnique({ where: { id: req.params.stopId }, include: { trip: true } });
    if (!stop || stop.trip.userId !== req.user.id) return res.status(404).json({ error: 'Stop not found' });
    const data = {};
    if (req.body?.title !== undefined) data.title = req.body.title;
    if (req.body?.budget !== undefined) data.budget = Number(req.body.budget) || 0;
    if (req.body?.arrivalDate) data.arrivalDate = parseDate(req.body.arrivalDate);
    if (req.body?.departureDate) data.departureDate = parseDate(req.body.departureDate);
    if (req.body?.cityId) data.cityId = req.body.cityId;
    const updated = await prisma.stop.update({ where: { id: stop.id }, data });
    res.json(updated);
  } catch (err) { next(err); }
});

router.delete('/stops/:stopId', async (req, res, next) => {
  try {
    const stop = await prisma.stop.findUnique({ where: { id: req.params.stopId }, include: { trip: true } });
    if (!stop || stop.trip.userId !== req.user.id) return res.status(404).json({ error: 'Stop not found' });
    await prisma.stop.delete({ where: { id: stop.id } });
    res.status(204).end();
  } catch (err) { next(err); }
});

// ---------- itinerary items ----------

router.post('/stops/:stopId/items', async (req, res, next) => {
  try {
    const stop = await prisma.stop.findUnique({ where: { id: req.params.stopId }, include: { trip: true } });
    if (!stop || stop.trip.userId !== req.user.id) return res.status(404).json({ error: 'Stop not found' });
    const { activityId, title, date, time, cost, category } = req.body || {};
    if (!title || !date) return res.status(400).json({ error: 'Title and date are required' });
    let finalTitle = title;
    if (activityId) {
      const activity = await prisma.activity.findUnique({ where: { id: activityId } });
      if (!activity) return res.status(404).json({ error: 'Activity not found' });
      if (activityId && title === undefined) finalTitle = activity.name;
    }
    const item = await prisma.itineraryItem.create({
      data: {
        stopId: stop.id,
        activityId: activityId || null,
        title: finalTitle,
        date: parseDate(date),
        time,
        cost: Number(cost) || 0,
        category: category || 'activity',
      },
    });
    res.status(201).json(item);
  } catch (err) { next(err); }
});

router.patch('/items/:itemId', async (req, res, next) => {
  try {
    const item = await prisma.itineraryItem.findUnique({
      where: { id: req.params.itemId },
      include: { stop: { include: { trip: true } } },
    });
    if (!item || item.stop.trip.userId !== req.user.id) return res.status(404).json({ error: 'Item not found' });
    const data = {};
    for (const key of ['title', 'time', 'category']) if (req.body?.[key] !== undefined) data[key] = req.body[key];
    if (req.body?.cost !== undefined) data.cost = Number(req.body.cost) || 0;
    if (req.body?.date) data.date = parseDate(req.body.date);
    const updated = await prisma.itineraryItem.update({ where: { id: item.id }, data });
    res.json(updated);
  } catch (err) { next(err); }
});

router.delete('/items/:itemId', async (req, res, next) => {
  try {
    const item = await prisma.itineraryItem.findUnique({
      where: { id: req.params.itemId },
      include: { stop: { include: { trip: true } } },
    });
    if (!item || item.stop.trip.userId !== req.user.id) return res.status(404).json({ error: 'Item not found' });
    await prisma.itineraryItem.delete({ where: { id: item.id } });
    res.status(204).end();
  } catch (err) { next(err); }
});

// ---------- budget ----------

router.get('/:id/budget', async (req, res, next) => {
  try {
    const trip = await findOwnedTrip(req, res);
    if (!trip) return;
    const byCategory = { transport: 0, stay: 0, activity: 0, meal: 0 };
    const byDay = {};
    for (const stop of trip.stops) {
      for (const item of stop.items) {
        byCategory[item.category] = (byCategory[item.category] || 0) + item.cost;
        const d = day(item.date);
        byDay[d] = (byDay[d] || 0) + item.cost;
      }
    }
    const start = parseDate(trip.startDate);
    const end = parseDate(trip.endDate);
    const totalDays = Math.max(1, Math.round((end - start) / 86400000) + 1);
    const spent = Object.values(byDay).reduce((a, b) => a + b, 0);
    const overBudgetDays = Object.entries(byDay)
      .filter(([, v]) => v > trip.totalBudget / totalDays)
      .map(([k]) => k);
    res.json({
      totalBudget: trip.totalBudget,
      spent,
      remaining: trip.totalBudget - spent,
      currency: trip.currency,
      byCategory,
      averageCostPerDay: Math.round(spent / totalDays),
      totalDays,
      dailySpend: Object.entries(byDay).map(([date, amount]) => ({ date, amount })),
      overBudgetDays,
    });
  } catch (err) { next(err); }
});

// ---------- sharing ----------

router.post('/:id/share', async (req, res, next) => {
  try {
    const trip = await findOwnedTrip(req, res);
    if (!trip) return;
    const makePublic = !trip.isPublic;
    const shareSlug = makePublic ? trip.shareSlug || crypto.randomBytes(8).toString('hex') : trip.shareSlug;
    const updated = await prisma.trip.update({
      where: { id: trip.id },
      data: { isPublic: makePublic, shareSlug },
    });
    res.json({ isPublic: updated.isPublic, shareUrl: `/shared/${updated.shareSlug}` });
  } catch (err) { next(err); }
});

export default router;
