import { Request } from "express"

export type JWTBody = {
  userId?: number,
  reptileId?: number
}

export type RequestWithJWTBody = Request & {
  jwtBody?: JWTBody
}
