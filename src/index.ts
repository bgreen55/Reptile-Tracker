import express from "express";
import { PrismaClient } from "@prisma/client";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { usersController } from "./controllers/users_controller";
import { reptilesController } from "./controllers/reptiles_controller";
import { feedingsController } from "./controllers/feedings_controller";
import { husbandryController } from "./controllers/husbandry_controller";
import { schedulesController } from "./controllers/schedules_controller";
import { engine } from "express-handlebars";

dotenv.config();
const client = new PrismaClient();
const app = express();

app.engine("hbs", engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "/views"));

app.use(cors());
app.use(express.json());
app.use(cookieParser());

reptilesController(app, client);
usersController(app, client);
feedingsController(app, client);
husbandryController(app, client);
schedulesController(app, client);

// Redirects asset requests to client server
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    if (req.path.match(/\.\w+$/)) {
      fetch(`${process.env.ASSET_URL}/${req.path}`).then((response) => {
        if (response.ok) {
          res.redirect(response.url);
        } else {
          // handle dev problems here
        }
      });
    } else {
      next();
    }
  })
} else {
  app.use("/static", express.static(path.join(__dirname, "static")))
}

// Returns client page from server
app.get("*", (req, res) => {
  if (process.env.NODE_ENV === "production") {
    const manifest = require("./static/manifest.json");
    res.render("app", {
      development: false,
      jsUrl: manifest["src/main.tsx"].file,
      cssUrl: manifest["src/main.css"].file
    })
  } else {
    res.render("app", {
      development: true,
      assetUrl: process.env.ASSET_URL,
    });
  }

})

app.listen(parseInt(process.env.PORT || "3000", 10), () => {
  console.log(`App running on port ${process.env.PORT}`);
});

export default app;