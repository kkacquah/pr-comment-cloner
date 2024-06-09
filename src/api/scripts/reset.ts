import { exec } from "child_process";
import { config } from "../../config/options";

const createDatabase = () => {
  const { user, password, database } = config.postgres;
  const createDbCommand = `docker exec postgres psql -U ${user} -c 'CREATE DATABASE IF NOT EXISTS "${database}" OWNER "${user}";'`;

  exec(
    createDbCommand,
    {
      env: {
        ...process.env,
        PGPASSWORD: password,
      },
    },
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error creating database: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Error output: ${stderr}`);
        return;
      }
      console.log("Database created successfully:", stdout);
    }
  );
};

// Execute the database reset operations
createDatabase();
