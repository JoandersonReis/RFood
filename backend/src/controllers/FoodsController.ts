import knex from "../database/connection"
import { Request, Response } from "express"

export default class FoodsController {
  async index(req: Request, res: Response) {
    const foods = await knex("foods").select("*")

    const serializedFoods = foods.map(food => {
      return {
        ...food,
        image_url: `http://10.0.0.104:3333/uploads/${food.image}`
      }
    })

    res.json(serializedFoods)
  }
}