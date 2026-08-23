const { getUserCollection, getOrderCollection } = require('../lib/mongodb');

async function run() {
  try {
    const users = await getUserCollection();
    const orders = await getOrderCollection();
    // Delete all non-admin users
    const deleteResult = await users.deleteMany({ isAdmin: { $ne: true } });
    console.log('🗑️ Deleted users:', deleteResult.deletedCount);
    // Optionally delete orders belonging to those users
    const orderDeleteResult = await orders.deleteMany({}); // delete all orders (or could filter by userId not admin)
    console.log('🗑️ Deleted orders:', orderDeleteResult.deletedCount);
    console.log('✅ Clean up complete');
  } catch (err) {
    console.error('❌ Error cleaning DB:', err);
  }
}

run();
