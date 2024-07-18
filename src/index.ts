import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import errorHandler from "./Errors/errorHandler";
import clubRoutes from "./routes/clubs";
import playerRoutes from "./routes/players";

AppDataSource.initialize()
  .then(async () => {
    // create express app
    const app = express();
    const port = 8080;
    app.use(bodyParser.json());

    app.get("/", (req: Request, res: Response) => {
      res.send("Welcome to Ola's App");
    });

    app.use("/clubs", clubRoutes);
    app.use("/players", playerRoutes);

    app.use(errorHandler);

    app.listen(port, () => {
      console.log(
        "Express server has started on port 8080. Open http://localhost:8080 to see results"
      );
    });
  })
  .catch((error) => console.log(error));
