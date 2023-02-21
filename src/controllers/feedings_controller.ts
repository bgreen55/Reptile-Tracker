import { PrismaClient } from "@prisma/client";
import { Express, RequestHandler } from "express";
import { JWTBody, RequestWithJWTBody } from "../dto/jwt";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { controller } from "../lib/controller";

type CreateFeedingBody = {
  reptileId : number,
  foodItem : string
}

const createFeeding = (client: PrismaClient): RequestHandler =>
  async (req : RequestWithJWTBody, res) => {
    const userId = req.jwtBody?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const {reptileId, foodItem} = req.body as CreateFeedingBody;
    const feeding = await client.feeding.create({
      data: {
        reptile: {connect : { id: reptileId }},
        foodItem,
      },
  });

  res.json({ feeding });
}

type GetFeedingsBody = {
  reptileId : number,
}

const getAllFeedings = (client: PrismaClient): RequestHandler =>
  async (req : RequestWithJWTBody, res) => {
    const userId = req.jwtBody?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const {reptileId} = req.body as GetFeedingsBody;
    const feedings = await client.feeding.findMany({
      where: {
        reptileId
      }
  });

    res.json({ feedings });
  }

export const feedingsController = controller(
  "feedings",
  [
    { path: "/all", method: "get", endpointBuilder: getAllFeedings, skipAuth: false },
    { path: "/create", method: "post", endpointBuilder: createFeeding, skipAuth: false }
  ]
)