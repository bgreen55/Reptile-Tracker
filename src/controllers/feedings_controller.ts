import { PrismaClient } from "@prisma/client";
import { Express, RequestHandler } from "express";
import { JWTBody, RequestWithJWTBody } from "../dto/jwt";
import jwt from "jsonwebtoken";
import { controller } from "../lib/controller";

type CreateFeedingBody = {
  reptileId : number
  foodItem : string
}

const createFeeding = (client: PrismaClient): RequestHandler =>
  async (req : RequestWithJWTBody, res) => {
    const {reptileId, foodItem} = req.body as CreateFeedingBody;

    const userId = req.jwtBody?.userId;
    const reptiles = req.jwtBody?.reptiles;
    console.log(userId);
    console.log(reptiles);
    if (!userId || !reptiles || !(reptiles.includes(reptileId))) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    
    const feeding = await client.feeding.create({
      data: {
        reptile: {connect : { id: reptileId }},
        foodItem,
      },
    });

  res.json({ feeding });
}

const getAllFeedings = (client: PrismaClient): RequestHandler =>
  async (req : RequestWithJWTBody, res) => {
    const reptileId = Number(req.params.reptileId);
    
    const userId = req.jwtBody?.userId;
    const reptiles = req.jwtBody?.reptiles;
    if (!userId || !reptiles || !(reptiles.includes(reptileId))) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

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
    { path: "/all/:reptileId", method: "get", endpointBuilder: getAllFeedings, skipAuth: false },
    { path: "/create", method: "post", endpointBuilder: createFeeding, skipAuth: false }
  ]
)