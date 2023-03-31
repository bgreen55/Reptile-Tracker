import { PrismaClient } from "@prisma/client";
import { Express, RequestHandler } from "express";
import { JWTBody, RequestWithJWTBody } from "../dto/jwt";
import jwt from "jsonwebtoken";
import { controller } from "../lib/controller";

type CreateHusbandryBody = {
  reptileId : number,
  length : number,
  weight : number,
  temperature : number,
  humidity : number,
}

const createHusbandry = (client: PrismaClient): RequestHandler =>
async (req : RequestWithJWTBody, res) => {
    const {reptileId, length, weight, temperature, humidity} = req.body as CreateHusbandryBody;
    
    const userId = req.jwtBody?.userId;
    const reptiles = req.jwtBody?.reptiles;
    if (!userId || !reptiles || !(reptiles.includes(reptileId))) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!(!isNaN(length) && length > 0 && !isNaN(weight) && weight > 0 && !isNaN(temperature) && !isNaN(humidity) && humidity > 0)) {
      res.status(400).json({ message: "Bad Request"});
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
    const reptileId = Number(req.params.reptileId);

    const userId = req.jwtBody?.userId;
    const reptiles = req.jwtBody?.reptiles;
    if (!userId || !reptiles || !(reptiles.includes(reptileId))) {
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
    { path: "/all/:reptileId", method: "get", endpointBuilder: getAllHusbandry, skipAuth: false },
    { path: "/create", method: "post", endpointBuilder: createHusbandry, skipAuth: false }
  ]
)