import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { cityId = '', category = '', maxCost = '' } = req.query;
    const activities = await prisma.activity.findMany({
      where: {
        AND: [
          cityId ? { cityId } : {},
          category ? { category: { equals: category, mode: 'insensitive' } } : {},
          maxCost ? { cost: { lte: Number(maxCost) } } : {},
        ],
      },
      include: { city: { select: { name: true, country: true, imageUrl: true } } },
      orderBy: { name: 'asc' },
    });
    res.json(activities);
  } catch (err) { next(err); }
});

export default router;
