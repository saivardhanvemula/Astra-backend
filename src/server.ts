import dotenv from "dotenv";
import app from "./app";
import prisma from "./config/db";

dotenv.config();

const PORT = Number(process.env.PORT) || 5000;

async function start() {
  try {
    await prisma.$connect();
    console.log("Connected to database");

    const server = app.listen(PORT, () => {
      console.log(`\n🏋️  Astra Gym API running on http://localhost:${PORT}`);
      console.log(`   Environment : ${process.env.NODE_ENV ?? "development"}`);
      console.log(`   Health check: http://localhost:${PORT}/health\n`);
    });

    const shutdown = async (signal: string) => {
      console.log(`\n${signal} received. Closing server…`);
      server.close(async () => {
        await prisma.$disconnect();
        console.log("PostgreSQL connection closed. Bye!");
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (err) {
    console.error("Failed to start", err);
    process.exit(1);
  }
}

start();
