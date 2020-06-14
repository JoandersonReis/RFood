import knex from "../database/connection"
import { Request, Response } from "express"

class PointsController {
  async index(req: Request, res: Response) {
    const { city, uf, foods } = req.query

    const parsedFoods = String(foods).split(",").map((food: string) => Number(food.trim()))

    const points = await knex("points")
    .join("points_foods", "points.id", "=", "points_foods.point_id")
    .whereIn("points_foods.food_id", parsedFoods)
    .where("points.city", String(city))
    .where("points.uf", String(uf))
    .distinct()
    .select("points.*")

    const serializedPoints = points.map(point => {
      return {
        ...point,
        image_url: `http://http://10.0.0.104:3333/uploads/${point.image}`
      }
    })

    return res.json(serializedPoints)
  }
  async show(req: Request, res: Response) {
    const { id } = req.params

    const point = await knex("points").select("*").where("id", id).first()

    if(!point) {
      return res.status(400).json({ error: "Point not found" })
    }

    const serializedPoints = {
      ...point,
      image_url: `http://10.0.0.104:3333/uploads/${point.image}`
    }

    const foods = await knex("foods")
      .join("points_foods", "foods.id", "=", "points_foods.food_id")
      .where("points_foods.point_id", id)
      .select("foods.name")

    return res.json({point: serializedPoints, foods})
  }
  async create(req: Request, res: Response) {
    const { name, email, whatsapp, city, uf, latitude, longitude, foods } = req.body

    const trx = await knex.transaction()

    const point = {
      name,
      image: req.file.filename,
      email,
      whatsapp,
      city,
      uf,
      latitude,
      longitude
    }

    const insertedIds = await trx("points").insert(point)

    const point_id = insertedIds[0]

    const pointFoods = foods
      .split(",")
      .map((food: string) => Number(food.trim()))
      .map((food_id: number) => (
        { food_id, point_id }
      ))

    await trx("points_foods").insert(pointFoods)

    trx.commit()

    return res.json({ id: point_id, ...point })

  }
}

export default PointsController
