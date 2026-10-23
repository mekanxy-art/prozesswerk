import "dotenv/config";
import { deliverBatch } from "../src/lib/delivery";
import { db } from "../src/lib/db";
deliverBatch()
  .then((result) =>
    console.log(JSON.stringify({ event: "worker_batch", ...result })),
  )
  .finally(() => db.$disconnect());
