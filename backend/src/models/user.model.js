const prisma = require('../config/db');

const publicUserFields = {
  id: true,
  name: true,
  email: true,
  role: true,
  created_at: true,
};

function findByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

function findPublicById(id) {
  return prisma.user.findUnique({ where: { id }, select: publicUserFields });
}

async function existsByEmail(email) {
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  return user !== null;
}

function create({ name, email, passwordHash, role }) {
  return prisma.user.create({
    data: { name, email, password_hash: passwordHash, role },
    select: publicUserFields,
  });
}

module.exports = { findByEmail, findPublicById, existsByEmail, create };
