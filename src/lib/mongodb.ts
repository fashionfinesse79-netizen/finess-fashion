import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

let client: MongoClient | null = null;

const MONGODB_URI = process.env.MONGODB_URI;
let useMock = !MONGODB_URI || MONGODB_URI.includes('your-mongodb-atlas-connection-string');

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
  if (useMock) {
    return null as any;
  }
  if (client) return client;
  if (!MONGODB_URI) {
    useMock = true;
    return null as any;
  }
  try {
    client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000,
    });
    await client.connect();
    return client;
  } catch (err) {
    console.warn('⚠️ MongoDB Atlas connection failed or timed out. Falling back to local Mock Database.');
    useMock = true;
    client = null;
    return null as any;
  }
}

export async function getUserCollection() {
  if (useMock) {
    return new MockCollection('users') as any;
  }
  try {
    const client = await getMongoClient();
    if (useMock || !client) {
      return new MockCollection('users') as any;
    }
    return client.db().collection('users');
  } catch (err) {
    useMock = true;
    return new MockCollection('users') as any;
  }
}

export async function getOrderCollection() {
  if (useMock) {
    return new MockCollection('orders') as any;
  }
  try {
    const client = await getMongoClient();
    if (useMock || !client) {
      return new MockCollection('orders') as any;
    }
    return client.db().collection('orders');
  } catch (err) {
    useMock = true;
    return new MockCollection('orders') as any;
  }
}

export async function getProductCollection() {
  if (useMock) {
    return new MockCollection('products') as any;
  }
  try {
    const client = await getMongoClient();
    if (useMock || !client) {
      return new MockCollection('products') as any;
    }
    return client.db().collection('products');
  } catch (err) {
    useMock = true;
    return new MockCollection('products') as any;
  }
}

export async function getPosterCollection() {
  if (useMock) {
    return new MockCollection('posters') as any;
  }
  try {
    const client = await getMongoClient();
    if (useMock || !client) {
      return new MockCollection('posters') as any;
    }
    return client.db().collection('posters');
  } catch (err) {
    useMock = true;
    return new MockCollection('posters') as any;
  }
}

export async function getVideoCollection() {
  if (useMock) {
    return new MockCollection('videos') as any;
  }
  try {
    const client = await getMongoClient();
    if (useMock || !client) {
      return new MockCollection('videos') as any;
    }
    return client.db().collection('videos');
  } catch (err) {
    useMock = true;
    return new MockCollection('videos') as any;
  }
}

export async function getCouponCollection() {
  if (useMock) {
    return new MockCollection('coupons') as any;
  }
  try {
    const client = await getMongoClient();
    if (useMock || !client) {
      return new MockCollection('coupons') as any;
    }
    return client.db().collection('coupons');
  } catch (err) {
    useMock = true;
    return new MockCollection('coupons') as any;
  }
}

