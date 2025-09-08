// setup evn
import { resolve } from "node:path";
import { config } from "dotenv";
config({ path: resolve("./config/.env.development") });

// load express and express types
import express from "express";
import type { Response, Request, Express } from "express";

// third party middleware
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

// modules-routing
import authController from "./modules/auth/auth.controller.js";
import { globalErrorHandling } from "./utils/response/error.response.js";
import connectDB from "./DB/connection.db.js";

// app-start-point
const bootstrap = async (): Promise<void> => {
  const app: Express = express();
  const port: number | string = process.env.PORT || 5000;

  const limiter = rateLimit({
    windowMs: 60 * 60000,
    limit: 20000,
    message: { error: "Too many requests , try again later" },
  });

  app.use(express.json());
  app.use(cors());
  app.use(helmet());
  app.use(limiter);

  // app_routing
  app.get("/", (req: Request, res: Response) => {
    res.json({
      message: `Welcome to ${process.env.APPLICATION_NAME} backend landing page 💖`,
    });
  });

  // sub-routing
  app.use("/auth", authController);

  // in-valid routing
  app.use("{/*dummy}", (req: Request, res: Response) => {
    return res.status(404).json({ message: "In-valid Routing try again ❌" });
  });

  // global -error -handling
  app.use(globalErrorHandling);

  //DB
  await connectDB();

  app.listen(port, () => {
    console.log(`Server is Running on ${port} 🚀`);
  });
};
export default bootstrap;
