import express from "express";
import type { Express } from "express";
import serverconfig from "./config/serverconfig";
import { connectToDatabase } from "./config/database";
import cors from "cors";
import cookieParser from "cookie-parser";
import apiRoutes from "./routes/index";
import { errorMiddleware } from "./middlewares/error";
import path from "path";

class Server {
  app: Express;
  port: Number;
  constructor() {
    this.app = express();
    this.middleware();
    this.routes();
    this.error();
    this.port = Number(serverconfig.PORT) || 3000;
  }
  private middleware() {
    this.app.use(cors());
    this.app.use(cookieParser());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static(path.resolve(__dirname, "../frontend/dist")));
  }
  private routes() {
    this.app.use("/api", apiRoutes);
    this.app.get(/^\/(?!api).*/, (req, res) => {
      res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
    });
  }
  private error() {
    this.app.use(errorMiddleware);
  }
  public async start() {
    await connectToDatabase();
    this.app.listen(serverconfig.PORT, () => {
      console.log(`server started , http://localhost:${this.port}`);
    });
  }
}
export default new Server();
