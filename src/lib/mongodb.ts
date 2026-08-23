import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

let client: MongoClient | null = null;

const MONGODB_URI = process.env.MONGODB_URI;
let useMock = !MONGODB_URI || MONGODB_URI.includes('your-mongodb-atlas-connection-string');

const DB_FILE = path.join(process.cwd(), 'src/lib/data/mock_db.json');

function readDb() {
  if (!fs.existsSync(DB_FILE)) {
    // Ensure dir exists
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], orders: [] }, null, 2), 'utf8');
    return { users: [], orders: [] };
  }
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (e) {
    return { users: [], orders: [] };
  }
}

function writeDb(data: any) {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

class MockCollection {
  name: 'users' | 'orders';

  constructor(name: 'users' | 'orders') {
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
