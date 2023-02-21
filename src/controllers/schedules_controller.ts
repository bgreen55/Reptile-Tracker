import { PrismaClient } from "@prisma/client";
import { Express, RequestHandler } from "express";
import { JWTBody, RequestWithJWTBody } from "../dto/jwt";
import jwt from "jsonwebtoken";
import { controller } from "../lib/controller";

type CreateScheduleBody = {
  type : string,
  description : string,
  monday : boolean,
  tuesday : boolean,
  wednesday : boolean,
  thursday : boolean,
  friday : boolean,
  saturday : boolean,
  sunday : boolean,
}

const createSchedule = (client: PrismaClient): RequestHandler =>
  async (req : RequestWithJWTBody, res) => {
    const userId = req.jwtBody?.userId;
    const reptileId = req.jwtBody?.reptileId;
    if (!userId || !reptileId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const {type, description, monday, tuesday, wednesday, thursday,
      friday, saturday, sunday} = req.body as CreateScheduleBody;
    const schedule = await client.schedule.create({
      data: {
        reptile: {connect : { id: reptileId }},
        user: {connect : { id: userId}},
        type,
        description,
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        sunday,
      },
  });

  res.json({ schedule });
}

const getAllSchedulesFromUser = (client: PrismaClient): RequestHandler =>
  async (req : RequestWithJWTBody, res) => {
    const userId = req.jwtBody?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const schedules = await client.schedule.findMany({
      where: {
        userId
      }
    });
    res.json({ schedules });
  }

const getAllSchedulesFromReptile = (client: PrismaClient): RequestHandler =>
async (req : RequestWithJWTBody, res) => {
  const userId = req.jwtBody?.userId;
  const reptileId = req.jwtBody?.reptileId;
  if (!userId || !reptileId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const schedules = await client.feeding.findMany({
    where: {
      reptileId
    }
  });
  res.json({ schedules });
}

export const schedulesController = controller(
  "schedules",
  [
    { path: "/all/user", method: "get", endpointBuilder: getAllSchedulesFromUser, skipAuth: false },
    { path: "/all/reptile", method: "get", endpointBuilder: getAllSchedulesFromReptile, skipAuth: false },
    { path: "/create", method: "post", endpointBuilder: createSchedule, skipAuth: false }
  ]
)