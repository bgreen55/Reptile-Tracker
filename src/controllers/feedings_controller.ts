import { PrismaClient } from "@prisma/client";
import { Express, RequestHandler } from "express";
import { JWTBody, RequestWithJWTBody } from "../dto/jwt";
import jwt from "jsonwebtoken";
import { controller } from "../lib/controller";

type CreateFeedingBody = {
  foodItem : string
}

const createFeeding = (client: PrismaClient): RequestHandler =>
  async (req : RequestWithJWTBody, res) => {
    const {foodItem} = req.body as CreateFeedingBody;

    const userId = req.jwtBody?.userId;
    const reptileId = req.jwtBody?.reptileId;
    if (!userId || !reptileId) {
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
    
    const userId = req.jwtBody?.userId;
    const reptileId = req.jwtBody?.reptileId;
    if (!userId || !reptileId) {
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
    { path: "/all", method: "get", endpointBuilder: getAllFeedings, skipAuth: false },
    { path: "/create", method: "post", endpointBuilder: createFeeding, skipAuth: false }
  ]
)