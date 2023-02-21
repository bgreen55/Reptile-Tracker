import express, { RequestHandler } from "express";
import { PrismaClient, User } from "@prisma/client";
import bcrypt from 'bcrypt';
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { JWTBody, RequestWithJWTBody } from "./dto/jwt";
import { usersController } from "./controllers/users_controller";

dotenv.config();
const client = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cookieParser());

//sign up

type LoginBody = {
  email: string,
  password: string
}

type signUpBody = {
  firstName: string,
  lastName: string,
  email: string,
  password: string
}

app.post("/users", async (req, res) => {
  console.log(req.body)
  console.log(req.body.firstName, req.body.lastName, req.body.email, req.body.password)
  const {firstName, lastName, email, password} = req.body as signUpBody;
  const passwordHash = await bcrypt.hash(password, 10); //pretty sure it breaks right here as it says that 'data and salt arguments required'
  const user = await client.user.create({
    data: {
      firstName,
      lastName,
      email,
      passwordHash
    }
  });
  res.json(user);
});

// log in
app.post("/sessions",  async (req, res) => {
  const {email, password} = req.body as LoginBody;
  const user = await client.user.findFirst({
    where: {
      email,
    }
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

  const token = jwt.sign({
    userId: user.id
  }, process.env.ENCRYPTION_KEY!!, {
    expiresIn: '10m'
  });
  res.json({
    user,
    token
  })
});

usersController(app, client);

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