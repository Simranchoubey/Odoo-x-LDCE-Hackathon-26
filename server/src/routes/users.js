import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

const publicUser = (u) => ({
  id: u.id,
  email: u.email,
  name: u.name,
  avatarUrl: u.avatarUrl,
  bio: u.bio,
  languagePref: u.languagePref,
});

router.get('/me', async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(publicUser(user));
  } catch (err) { next(err); }
});

router.patch('/me', async (req, res, next) => {
  try {
    const allowed = ['name', 'avatarUrl', 'bio', 'languagePref'];
    const data = {};
    for (const key of allowed) if (req.body?.[key] !== undefined) data[key] = req.body[key];
    if (!Object.keys(data).length) return res.status(400).json({ error: 'No valid fields to update' });
    const user = await prisma.user.update({ where: { id: req.user.id }, data });
    res.json(publicUser(user));
  } catch (err) { next(err); }
});

router.delete('/me', async (req, res, next) => {
  try {
    await prisma.user.delete({ where: { id: req.user.id } });
    res.status(204).end();
  } catch (err) { next(err); }
});

export default router;
