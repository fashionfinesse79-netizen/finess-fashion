import { getUserCollection } from '../lib/mongodb';
import { hash } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../models/User.js';

/**
 * Seed a default admin user for development.
 * If an admin already exists (email matches either of the two accepted admin emails),
 * the script does nothing.
 *
 * The default credentials are:
 *   email: admin@finess.fashion
 *   password: AdminPass123!
 *
 * **IMPORTANT**: Change the password after the first login.
 */
async function run() {
  const users = await getUserCollection();
  const existing = await users.findOne({
    email: { $in: ['admin@finess.fashion', 'admin@finesse.fashion'] },
  });

  if (existing) {
    console.log('✅ Admin user already exists →', existing.email);
    return;
  }

  const adminEmail = 'admin@finess.fashion';
  const adminPassword = 'AdminPass123!';
  const passwordHash = await hash(adminPassword, 10);

  const adminUser: User = {
    id: uuidv4(),
    email: adminEmail,
    passwordHash,
    name: 'Admin',
    phone: '',
    addresses: [],
    savedWishlistIds: [],
    isAdmin: true,
  };

  await users.insertOne(adminUser);
  console.log('✅ Admin user created →', adminEmail);
  console.log('   Password (change after first login):', adminPassword);
}

run().catch((err) => {
  console.error('❌ Error seeding admin:', err);
  process.exit(1);
});
