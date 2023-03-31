import { Request } from "express"

export type JWTBody = {
  userId?: number,
  reptiles?: number[]
}

export type RequestWithJWTBody = Request & {
  jwtBody?: JWTBody
}
