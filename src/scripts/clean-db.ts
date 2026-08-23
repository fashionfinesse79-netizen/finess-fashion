import { getUserCollection, getOrderCollection } from '../lib/mongodb';

async function run() {
  try {
    const users = await getUserCollection();
    const orders = await getOrderCollection();
    // Delete all non‑admin users
    const deleteResult = await users.deleteMany({ isAdmin: { $ne: true } });
    console.log('🗑️ Deleted users:', deleteResult.deletedCount);
    // Delete all orders (you can keep admin orders if you wish)
    const orderDeleteResult = await orders.deleteMany({});
    console.log('🗑️ Deleted orders:', orderDeleteResult.deletedCount);
    console.log('✅ Clean‑up complete');
  } catch (err) {
    console.error('❌ Clean‑up error:', err);
  }
}

run();
