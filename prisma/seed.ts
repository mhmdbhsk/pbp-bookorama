const hash = require('bcrypt').hash;
const PrismaClient = require('@prisma/client').PrismaClient;

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany({});

  const passwordAdmin = await hash('admin', 12);
  const passwordUser = await hash('user', 12);

  const admin = await prisma.user.upsert({
    where: {
      email: 'admin@test.com',
    },
    update: {},
    create: {
      email: 'admin@test.com',
      name: 'Test Admin',
      role: 'ADMIN',
      password: passwordAdmin,
    },
  });

  const customer = await prisma.user.upsert({
    where: {
      email: 'user@test.com',
    },
    update: {},
    create: {
      email: 'user@test.com',
      name: 'Test Customer',
      role: 'CUSTOMER',
      password: passwordUser,
    },
  });

  console.log('🎉 Created admin account ', admin);
  console.log('🎉 Created customer account', customer);

  console.log('Seed data created successfully!');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
