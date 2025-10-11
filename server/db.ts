import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
// note: we only initialize a real DB when DATABASE_URL is provided

neonConfig.webSocketConstructor = ws;

export let pool: any = undefined; 
export let db: any = undefined;
export const hasDatabase = Boolean(process.env.DATABASE_URL);

if (hasDatabase) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzleNeon({ client: pool, schema } as any);
} else {
  pool = undefined;
  db = undefined as any;
}
