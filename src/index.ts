import express, { RequestHandler } from "express";
import { PrismaClient, User } from "@prisma/client";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { JWTBody, RequestWithJWTBody } from "./dto/jwt";
import { usersController } from "./controllers/users_controller";
import { reptilesController } from "./controllers/reptiles_controller";
import { feedingsController } from "./controllers/feedings_controller";
import { husbandryController } from "./controllers/husbandry_controller";
import { schedulesController } from "./controllers/schedules_controller";
import bcrypt from "bcrypt";

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

//this is middleware for index page, shows login fields and register button
app.get("/", (req, res) => {
  res.send(`
    <h1>Reptile Manager</h1>
    <form method="POST" action="/sessions">
      <input type="email" name="email" placeholder="Email" />
      <input type="password" name="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
    <form method="POST" action="/users/create">
      <input type="text" name="firstName" placeholder="First Name" />
      <input type="text" name="lastName" placeholder="Last Name" />
      <input type="email" name="email" placeholder="Email" />
      <input type="password" name="password" placeholder="Password" />
      <button type="submit">Register</button>
    </form>
  `);
});

//middleware for users, returns all users
app.get("/users", async (req, res) => {
  const users = await client.user.findMany();
  res.json(users);
});

//middleware for user to login
app.post("/sessions", async (req, res) => {
  const { email, password } = req.body;
  const user = await client.user.findFirst({
    where: {
      email,
    },
  });
  if (!user) {
    res.status(404).json({ message: "Invalid email or password" });
    return;
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    res.status(404).json({ message: "Invalid email or password" });
    return;
  }

  const token = jwt.sign(
    {
      userId: user.id,
    },
    process.env.ENCRYPTION_KEY!!,
    {
      expiresIn: "1000m",
    }
  );
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  res.json({
    user,
    token,
  });
});


//middleware for user to register
app.post("/users/create", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  //const passwordHash = await bcrypt.hash(password, 10);
  const passwordHash = await password;
  const user = await client.user.create({
    data: {
      firstName,
      lastName,
      email,
      passwordHash,
    },
  });

  const token = jwt.sign(
    {
      userId: user.id,
    },
    process.env.ENCRYPTION_KEY!!,
    {
      expiresIn: "1000m",
    }
  );

  res.json({ user, token });
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