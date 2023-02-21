import { PrismaClient } from "@prisma/client";
import { Express, RequestHandler } from "express";
import { JWTBody, RequestWithJWTBody } from "../dto/jwt";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { controller } from "../lib/controller";

type CreateReptileBody = {
  species : string
  name : string
  sex : string
}

const createReptile = (client: PrismaClient): RequestHandler =>
  async (req : RequestWithJWTBody, res) => {
    console.log(req.body);
    const userId = req.jwtBody?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const {species, name, sex} = req.body as CreateReptileBody;
    const reptile = await client.reptile.create({
      data: {
        user: {connect : { id: userId }},
        species,
        name,
        sex,
      },
    });

    res.json({ reptile });
  }


export const reptilesController = controller(
  "reptiles",
  [
    { path: "/", method: "post", endpointBuilder: createReptile, skipAuth: true }
  ]
)