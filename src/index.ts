import "reflect-metadata";
import createServer from "./config/server";
import { AppDataSource } from "./data-source";

const host = "0.0.0.0";
const port = "8080";

const app = createServer();

AppDataSource.initialize()
  .then(() => {
    app.listen({ host, port }, () => {
      console.info(`⚡️ Server is running at http://${host}:${port}`);
    });
  })
  .catch(console.error);
