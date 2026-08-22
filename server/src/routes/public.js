import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';

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

router.get('/trips/:slug', async (req, res, next) => {
  try {
    const trip = await prisma.trip.findUnique({
      where: { shareSlug: req.params.slug },
      include: { ...tripInclude, user: { select: { name: true, avatarUrl: true } } },
    });
    if (!trip || !trip.isPublic) return res.status(404).json({ error: 'Shared trip not found' });
    const spent = trip.stops.reduce((s, st) => s + st.items.reduce((a, i) => a + i.cost, 0), 0);
    res.json({ ...serialize(trip, spent), owner: trip.user });
  } catch (err) { next(err); }
});

function serialize(t, spent) {
  const firstCity = t.stops?.[0]?.city;
  return {
    id: t.id,
    name: t.name,
    description: t.description || '',
    startDate: new Date(t.startDate).toISOString().slice(0, 10),
    endDate: new Date(t.endDate).toISOString().slice(0, 10),
    image: t.coverImage || firstCity?.imageUrl || null,
    destination: firstCity ? `${firstCity.name}, ${firstCity.country}` : '',
    budget: { total: t.totalBudget, spent, currency: t.currency },
    sections: t.stops.map((s) => ({
      id: s.id,
      title: s.title || `${s.city.name}`,
      startDate: new Date(s.arrivalDate).toISOString().slice(0, 10),
      endDate: new Date(s.departureDate).toISOString().slice(0, 10),
      budget: s.budget,
      city: { id: s.city.id, name: s.city.name, country: s.city.country, image: s.city.imageUrl },
      activities: s.items.map((i) => ({
        id: i.id,
        name: i.title,
        expense: i.cost,
        time: i.time,
        date: new Date(i.date).toISOString().slice(0, 10),
        category: i.category,
      })),
    })),
  };
}

// Deep clone a public trip into the caller's account
router.post('/trips/:slug/copy', requireAuth, async (req, res, next) => {
  try {
    const source = await prisma.trip.findUnique({
      where: { shareSlug: req.params.slug },
      include: tripInclude,
    });
    if (!source || !source.isPublic) return res.status(404).json({ error: 'Shared trip not found' });

    const copy = await prisma.trip.create({
      data: {
        userId: req.user.id,
        name: `${source.name} (copy)`,
        description: source.description,
        coverImage: source.coverImage,
        totalBudget: source.totalBudget,
        currency: source.currency,
        status: 'planning',
        startDate: source.startDate,
        endDate: source.endDate,
        stops: {
          create: source.stops.map((s) => ({
            cityId: s.cityId,
            title: s.title,
            arrivalDate: s.arrivalDate,
            departureDate: s.departureDate,
            budget: s.budget,
            sortOrder: s.sortOrder,
            items: {
              create: s.items.map((i) => ({
                activityId: i.activityId,
                title: i.title,
                date: i.date,
                time: i.time,
                cost: i.cost,
                category: i.category,
              })),
            },
          })),
        },
      },
      include: tripInclude,
    });
    res.status(201).json({ id: copy.id, name: copy.name });
  } catch (err) { next(err); }
});

export default router;
