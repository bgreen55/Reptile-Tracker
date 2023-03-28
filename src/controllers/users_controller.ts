import { PrismaClient } from "@prisma/client";
import { Express, RequestHandler } from "express";
import { RequestWithJWTBody } from "../dto/jwt";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { controller } from "../lib/controller";

type LoginBody = {
  email: string,
  password: string
}
  
// log in
const getLogin = (client: PrismaClient): RequestHandler =>
  async (req, res) => {
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
      expiresIn: '1000m'
    });
    res.json({
      user,
      token
    })
};

type CreateUserBody = {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
}

const createUser = (client: PrismaClient): RequestHandler =>
  async (req, res) => {
    const {firstName, lastName, email, password} = req.body as CreateUserBody;
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

    const token = jwt.sign({
      userId: user.id
    }, process.env.ENCRYPTION_KEY!!, {
      expiresIn: '1000m'
    });

    res.json({ user, token });
  }


export const usersController = controller(
  "users",
  [
    { path: "/login", endpointBuilder: getLogin, method: "get", skipAuth: true},
    { path: "/create", method: "post", endpointBuilder: createUser, skipAuth: true}
  ]
)