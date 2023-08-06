"use strict"

import { NextFunction, Request, Response } from "express"

export default {
  validateImageParams(req: Request, res: Response, next: NextFunction): void {
    let imageId: string
    let width: number
    let height: number

    if (!req.query.imageId) {
      res.status(400).send("Can't proceed without Image ID")
      return
    } else {
      imageId = req.query.imageId as string
    }

    if (req.query.width && Number(req.query.width) <= 0) {
      res.status(400).send(`Invalid "width" value: ${req.query.width}`)
      return
    } else {
      width = Number(req.query.width) as number
    }

    if (req.query.height && Number(req.query.height) <= 0) {
      res.status(400).send(`Invalid "height" value: ${req.query.height}`)
      return
    } else {
      height = Number(req.query.width) as number
    }

    res.locals.imageId = imageId
    res.locals.width = width
    res.locals.height = height
    next()
  },
}
