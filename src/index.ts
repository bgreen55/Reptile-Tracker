import express, { RequestHandler } from "express";
import { PrismaClient, User } from "@prisma/client";
import bcrypt from 'bcrypt';
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { JWTBody, RequestWithJWTBody } from "./dto/jwt";
import { usersController } from "./controllers/users_controller";
import { reptilesController } from "./controllers/reptiles_controller";
import { feedingsController } from "./controllers/feedings_controller";
import { husbandryController } from "./controllers/husbandry_controller";
import { schedulesController } from "./controllers/schedules_controller";

dotenv.config();
const client = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cookieParser());

reptilesController(app, client);
usersController(app, client);
feedingsController(app, client);
husbandryController(app, client);
schedulesController(app, client);

//this is middleware for index page
app.get("/", (req, res) => {
  res.send(`<h1>Hello, world!</h1>`);
});

//middleware for users, returns all users
app.get("/users", async (req, res) => {
  const users = await client.user.findMany();
  res.json(users);
});

//middleware for user to logout
app.delete("/sessions", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

app.listen(parseInt(process.env.PORT || "3000", 10), () => {
  console.log(`App running on port ${process.env.PORT}`);
});

export default app;