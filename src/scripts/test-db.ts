import { getUserCollection, getOrderCollection } from '../lib/mongodb';

async function run() {
  try {
    const users = await getUserCollection();
    const orders = await getOrderCollection();
    const userCount = await users.countDocuments();
    const orderCount = await orders.countDocuments();
    console.log('✅ Connected to MongoDB Atlas');
    console.log('Users count:', userCount);
    console.log('Orders count:', orderCount);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
  }
}

run();
