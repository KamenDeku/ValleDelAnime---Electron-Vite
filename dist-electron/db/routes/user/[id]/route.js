// routes/user/[id]/route.ts
import { Router } from 'express';
import prisma from '../../../../Libs/prisma';
import { entities } from '../../../../db/entities';

const router = Router();

// GET /user/:id → obtener usuario por ID
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

  res.json(user);
});

// PUT /user/:id → reemplazar usuario completo
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const parsed = entities.user.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.format() });
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data: parsed.data,
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar', details: err });
  }
});

// PATCH /user/:id → actualizar parcialmente
router.patch('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const user = await prisma.user.update({
    where: { id },
    data: req.body,
  });

  res.json(user);
});

// DELETE /user/:id → eliminar usuario
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  await prisma.user.delete({ where: { id } });
  res.json({ success: true });
});

export default router;
