import { PrismaClient } from "@prisma/client";
import { Express, RequestHandler } from "express";
import { JWTBody, RequestWithJWTBody } from "../dto/jwt";
import jwt from "jsonwebtoken";
import { controller } from "../lib/controller";

type CreateHusbandryBody = {
  length : number,
  weight : number,
  temperature : number,
  humidity : number,
}

const createHusbandry = (client: PrismaClient): RequestHandler =>
async (req : RequestWithJWTBody, res) => {
    const {length, weight, temperature, humidity} = req.body as CreateHusbandryBody;
    
    const userId = req.jwtBody?.userId;
    const reptileId = req.jwtBody?.reptileId;
    if (!userId || !reptileId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    
    const husbandry = await client.husbandryRecord.create({
      data: {
        reptile: {connect : { id: reptileId }},
        length,
        weight,
        temperature,
        humidity,
      },
  });

  res.json({ husbandry });
}

const getAllHusbandry = (client: PrismaClient): RequestHandler =>
  async (req : RequestWithJWTBody, res) => {

    const userId = req.jwtBody?.userId;
    const reptileId = req.jwtBody?.reptileId;
    if (!userId || !reptileId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const husbandry = await client.husbandryRecord.findMany({
      where: {
        reptileId
      }
  });

    res.json({ husbandry });
  }

export const husbandryController = controller(
  "husbandry",
  [
    { path: "/all", method: "get", endpointBuilder: getAllHusbandry, skipAuth: false },
    { path: "/create", method: "post", endpointBuilder: createHusbandry, skipAuth: false }
  ]
)