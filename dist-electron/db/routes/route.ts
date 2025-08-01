import { Router } from 'express';
import prisma from '../../Libs/prisma';
import { entities } from '../../../../../shared/entities';

const router = Router();

// GET /user → obtener todos los usuarios
router.get('/', async (_, res) => {
  const users = await prisma.user.findMany({
    include: { shift: true, receipts: true },
  });
  res.json(users);
});

// POST /user → crear un nuevo usuario
router.post('/', async (req, res) => {
  const parsed = entities.user.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.format() });
  }

  const data = parsed.data;

  try {
    const user = await prisma.user.create({ data });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear el usuario', details: err });
  }
});

export default router;
