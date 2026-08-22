import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/stats', async (req, res, next) => {
  try {
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [totalUsers, totalTrips, totalStops, totalItems, publicTrips, newUsers30d, cities, activities] =
      await Promise.all([
        prisma.user.count(),
        prisma.trip.count(),
        prisma.stop.count(),
        prisma.itineraryItem.count(),
        prisma.trip.count({ where: { isPublic: true } }),
        prisma.user.count({ where: { createdAt: { gte: since } } }),
        prisma.city.count(),
        prisma.activity.count(),
      ]);

    const tripsByStatus = await prisma.trip.groupBy({
      by: ['status'],
      _count: { _all: true },
    });

    const topCities = await prisma.city.findMany({
      select: {
        name: true,
        country: true,
        imageUrl: true,
        popularity: true,
        _count: { select: { stops: true } },
      },
      orderBy: { stops: { _count: 'desc' } },
      take: 8,
    });

    const topActivities = await prisma.activity.findMany({
      select: {
        name: true,
        category: true,
        city: { select: { name: true, country: true } },
        _count: { select: { items: true } },
      },
      orderBy: { items: { _count: 'desc' } },
      take: 8,
    });

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
        _count: { select: { trips: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      totals: {
        users: totalUsers,
        trips: totalTrips,
        stops: totalStops,
        itineraryItems: totalItems,
        publicTrips,
        newUsers30d,
        cities,
        activities,
        avgTripsPerUser: totalUsers ? +(totalTrips / totalUsers).toFixed(1) : 0,
      },
      tripsByStatus: tripsByStatus.map((s) => ({ status: s.status, count: s._count._all })),
      topCities: topCities.map((c) => ({
        name: c.name,
        country: c.country,
        imageUrl: c.imageUrl,
        popularity: c.popularity,
        visits: c._count.stops,
      })),
      topActivities: topActivities.map((a) => ({
        name: a.name,
        category: a.category,
        city: `${a.city.name}, ${a.city.country}`,
        usage: a._count.items,
      })),
      users: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        avatarUrl: u.avatarUrl,
        joinedAt: u.createdAt,
        tripsCount: u._count.trips,
      })),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
