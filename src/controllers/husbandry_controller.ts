import { PrismaClient } from "@prisma/client";
import { Express, RequestHandler } from "express";
import { JWTBody, RequestWithJWTBody } from "../dto/jwt";
import bcrypt from "bcrypt";
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
    const userId = req.jwtBody?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const {reptileId, length, weight, temperature, humidity} = req.body as CreateHusbandryBody;
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

type GetHusbandryBody = {
  reptileId : number,
}

const getAllHusbandry = (client: PrismaClient): RequestHandler =>
  async (req : RequestWithJWTBody, res) => {
    const userId = req.jwtBody?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const {reptileId} = req.body as GetHusbandryBody;
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