import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

let client: MongoClient | null = null;

const MONGODB_URI = process.env.MONGODB_URI;
const isMockConfigured = !MONGODB_URI || MONGODB_URI.includes('your-mongodb-atlas-connection-string');

const IS_VERCEL = !!process.env.VERCEL;
const BUNDLED_DB_FILE = path.join(process.cwd(), 'src/lib/data/mock_db.json');
const DB_FILE = IS_VERCEL ? '/tmp/mock_db.json' : BUNDLED_DB_FILE;

let inMemoryDb: any = null;

function readDb() {
  if (inMemoryDb) {
    return inMemoryDb;
  }

  if (!fs.existsSync(DB_FILE)) {
    try {
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (IS_VERCEL && fs.existsSync(BUNDLED_DB_FILE)) {
        const bundledContent = fs.readFileSync(BUNDLED_DB_FILE, 'utf8');
        fs.writeFileSync(DB_FILE, bundledContent, 'utf8');
      } else {
        fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], orders: [] }, null, 2), 'utf8');
      }
    } catch (e) {
      console.warn('⚠️ Writable database file could not be initialized. Initializing in-memory fallback.', e);
      if (fs.existsSync(BUNDLED_DB_FILE)) {
        try {
          inMemoryDb = JSON.parse(fs.readFileSync(BUNDLED_DB_FILE, 'utf8'));
        } catch (err) {
          inMemoryDb = { users: [], orders: [] };
        }
      } else {
        inMemoryDb = { users: [], orders: [] };
      }
      return inMemoryDb;
    }
  }

  try {
    const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    // Ensure admin user is seeded even if file is empty
    if (!data.users || data.users.length === 0) {
      data.users = [
        {
          id: "00000000-0000-0000-0000-000000000001",
          email: "admin@finess.fashion",
          passwordHash: "$2b$10$omuNM/13muTxk8xNd973XeQehktGhyRND.NkEu3icou/7TI3Vk4yq",
          name: "Admin",
          phone: "",
          addresses: [],
          savedWishlistIds: [],
          isAdmin: true
        }
      ];
    }
    inMemoryDb = data;
    return data;
  } catch (e) {
    return { users: [], orders: [] };
  }
}

function writeDb(data: any) {
  inMemoryDb = data;
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('⚠️ Failed to write to database file. Storing in-memory only.', e);
  }
}

class MockCollection {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  async findOne(query: any) {
    const db = readDb();
    const list = db[this.name] || [];
    return list.find((item: any) => {
      for (const key in query) {
        if (key === '$or') {
          return query.$or.some((subQuery: any) => {
            return Object.keys(subQuery).every(subKey => {
              const queryVal = subQuery[subKey];
              const itemVal = item[subKey];
              if (queryVal && typeof queryVal === 'object' && queryVal.$regex) {
                // simple match regex
                return new RegExp(queryVal.$regex.source || queryVal.$regex, 'i').test(itemVal);
              }
              return String(itemVal).toLowerCase() === String(queryVal).toLowerCase();
            });
          });
        }
        
        const queryVal = query[key];
        const itemVal = item[key];
        if (String(itemVal).toLowerCase() !== String(queryVal).toLowerCase()) {
          return false;
        }
      }
      return true;
    }) || null;
  }

  async insertOne(doc: any) {
    const db = readDb();
    if (!db[this.name]) db[this.name] = [];
    db[this.name].push(doc);
    writeDb(db);
    return { insertedId: doc.id || doc._id };
  }

  async updateOne(query: any, update: any) {
    const db = readDb();
    const list = db[this.name] || [];
    const index = list.findIndex((item: any) => {
      for (const key in query) {
        if (String(item[key]).toLowerCase() !== String(query[key]).toLowerCase()) {
          return false;
        }
      }
      return true;
    });

    if (index !== -1) {
      const item = list[index];
      if (update.$set) {
        Object.assign(item, update.$set);
      }
      if (update.$unset) {
        for (const key in update.$unset) {
          delete item[key];
        }
      }
      list[index] = item;
      writeDb(db);
    }
    return { modifiedCount: index !== -1 ? 1 : 0 };
  }

  find(query: any) {
    const db = readDb();
    const list = db[this.name] || [];
    const filtered = list.filter((item: any) => {
      for (const key in query) {
        if (String(item[key]).toLowerCase() !== String(query[key]).toLowerCase()) {
          return false;
        }
      }
      return true;
    });
    return {
      toArray: async () => filtered
    };
  }
}

export async function getMongoClient() {
  if (isMockConfigured) {
    return null as any;
  }
  if (client) return client;
  if (!MONGODB_URI) {
    return null as any;
  }
  try {
    client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    await client.connect();
    return client;
  } catch (err) {
    console.warn('⚠️ MongoDB Atlas connection error or timeout. Falling back to local store for this request.', err);
    client = null;
    return null as any;
  }
}

async function getCollectionOrFallback(collectionName: string) {
  if (isMockConfigured) {
    return new MockCollection(collectionName) as any;
  }
  try {
    const mongoClient = await getMongoClient();
    if (!mongoClient) {
      return new MockCollection(collectionName) as any;
    }
    return mongoClient.db().collection(collectionName);
  } catch (err) {
    console.warn(`⚠️ Error accessing MongoDB ${collectionName}. Using fallback for this request:`, err);
    return new MockCollection(collectionName) as any;
  }
}

export async function getUserCollection() {
  return getCollectionOrFallback('users');
}

export async function getOrderCollection() {
  return getCollectionOrFallback('orders');
}

export async function getProductCollection() {
  return getCollectionOrFallback('products');
}

export async function getPosterCollection() {
  return getCollectionOrFallback('posters');
}

export async function getVideoCollection() {
  return getCollectionOrFallback('videos');
}

export async function getCouponCollection() {
  return getCollectionOrFallback('coupons');
}

export async function getInstagramCollection() {
  return getCollectionOrFallback('instagram');
}


