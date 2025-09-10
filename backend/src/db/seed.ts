import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { faker } from "@faker-js/faker";
import { sql } from "drizzle-orm";
import * as schema from "./schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

const main = async () => {
  const pinsTable = schema.pins;
  const usersTable = schema.users;

  try {
    console.log("Seeding database...");

    await db.delete(pinsTable);
    // await db.delete(usersTable);

    // Seed users
    // const userSeed = Array.from({ length: 10 }).map(() => ({
    //   username: faker.internet.username(),
    //   email: faker.internet.email(),
    //   password: faker.internet.password(),
    // }));

    // await db.insert(usersTable).values(userSeed);

    // Seed pins
    const pinSeed = Array.from({ length: 20 }).map(() => {
      const lat = faker.location.latitude({ min: -23.6, max: -23.4 });
      const lng = faker.location.longitude({ min: -47.6, max: -47.3 });

      return {
        title: faker.lorem.words(3),
        description: faker.lorem.sentence(),
        category: faker.helpers.arrayElement(["Acessivel", "Parcialmente Acessivel", "Nao Acessivel"]),
        // ORDEM CORRETA: (longitude, latitude)
        location: sql`ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geometry`,
      };
    });

    await db.insert(pinsTable).values(pinSeed);

    console.log("Seeding completed.");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await pool.end();
  }
};

main();


