import { PrismaClient } from "@prisma/client";
import { Express, RequestHandler } from "express";
import { JWTBody, RequestWithJWTBody } from "../dto/jwt";
import jwt from "jsonwebtoken";
import { controller } from "../lib/controller";

type CreateReptileBody = {
  species : string
  name : string
  sex : string
}

const createReptile = (client: PrismaClient): RequestHandler =>
  async (req : RequestWithJWTBody, res) => {
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

type DeleteReptileBody = {
  reptileId : number
}

const deleteReptile = (client: PrismaClient): RequestHandler =>
  async (req : RequestWithJWTBody, res) => {
    const {reptileId} = req.body as DeleteReptileBody;

    const userId = req.jwtBody?.userId;
    const reptiles = req.jwtBody?.reptiles;
    if (!userId || !reptiles || !(reptiles.includes(reptileId))) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const reptile = await client.reptile.delete({
      where: {
        id : reptileId
      },
  });

  res.json({ reptile });
}

type UpdateReptileBody = {
  reptileId : number
  species : string
  name : string
  sex : string
}

const updateReptile = (client: PrismaClient): RequestHandler =>
  async (req : RequestWithJWTBody, res) => {
    const {reptileId, species, name, sex} = req.body as UpdateReptileBody;

    const userId = req.jwtBody?.userId;
    const reptiles = req.jwtBody?.reptiles;
    console.log("UPDATING");
    console.log(reptileId);
    console.log(reptiles);
    if (reptiles) {
      console.log(reptiles.includes(reptileId));
    }
    if (!userId || !reptiles || !(reptiles.includes(reptileId))) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const reptile = await client.reptile.update({
      where: {
        id : reptileId
      },
      data: {
        species,
        name,
        sex,
      }
  });

  res.json({ reptile });
}

const getAllReptiltes = (client: PrismaClient): RequestHandler =>
  async (req : RequestWithJWTBody, res) => {
    const userId = req.jwtBody?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const reptiles = await client.user.findUnique({
      where: {
        id : userId
      },
      select: {
        reptiles : true
      }
  });

    res.json({ reptiles });
  }

export const reptilesController = controller(
  "reptiles",
  [
    { path: "/delete", method: "delete", endpointBuilder: deleteReptile, skipAuth: false},
    { path: "/all", method: "get", endpointBuilder: getAllReptiltes, skipAuth: false},
    { path: "/update", method: "put", endpointBuilder: updateReptile, skipAuth: false},
    { path: "/create", method: "post", endpointBuilder: createReptile, skipAuth: false}
  ]
)