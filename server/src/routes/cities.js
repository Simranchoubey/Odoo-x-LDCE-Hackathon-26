import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { search = '', country = '' } = req.query;
    const cities = await prisma.city.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { name: { contains: search, mode: 'insensitive' } },
                  { country: { contains: search, mode: 'insensitive' } },
                ],
              }
            : {},
          country ? { country: { equals: country, mode: 'insensitive' } } : {},
        ],
      },
      orderBy: [{ popularity: 'desc' }, { name: 'asc' }],
    });
    res.json(cities);
  } catch (err) { next(err); }
});

export default router;
