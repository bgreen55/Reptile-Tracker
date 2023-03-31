import { NextFunction, RequestHandler, Response } from "express";
import { RequestWithJWTBody, JWTBody } from "../dto/jwt";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

export const authenticationMiddleware = async (req: RequestWithJWTBody, res : Response, next : NextFunction, client : PrismaClient) => {
  const token = req.headers.authorization?.split(" ")[1];
  verify : try {
    // Throws error if invalid
    const jwtBody = jwt.verify(token || '', process.env.ENCRYPTION_KEY!!) as JWTBody;
    req.jwtBody = jwtBody;

    const userId = req.jwtBody.userId;

    const userReptiles = await client.reptile.findMany({
        where: {
        userId : userId,
        }
    });
    // Only adds reptileId to jwtBody if related to user
    console.log(userReptiles);
    const reptiles : number[] = [];
    userReptiles.forEach((reptile) => {
      reptiles.push(reptile.id);
    })
    console.log(reptiles);
    if (Object.keys(userReptiles).length == 0) {
        break verify;
    }

    req.jwtBody = {
      userId,
      reptiles,
    }
  } catch (error) {
    console.log("token failed validation");
  } finally {
    next();
  }
}