import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { join } from "path";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { VectorDbService } from "./api/vectorDb/vectorDbService";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false,
  synchronize: process.env.NODE_ENV === "test",
  entities:
    process.env.NODE_ENV === "production"
      ? ["build/models/entities/**/*.js"]
      : [join(__dirname, "./models/entities/**/*.ts")],
  subscribers:
    process.env.NODE_ENV === "production"
      ? ["build/subscribers/**/*.js"]
      : [join(__dirname, "./subscribers/**/*.ts")],
  migrations:
    process.env.NODE_ENV === "production"
      ? ["build/migrations/**/*.js"]
      : [join(__dirname, "./migrations/**/*.ts")],
  namingStrategy: new SnakeNamingStrategy(),
});

export const vectorDbService = new VectorDbService();
