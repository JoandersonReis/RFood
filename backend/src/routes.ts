import express from "express"
import multer from "multer"
import multerConfig from "./config/multer"
import PointsController from "./controllers/PointsController"
import FoodsController from "./controllers/FoodsController"

const router = express.Router()

const pointsController = new PointsController()
const foodsController = new FoodsController()

const upload = multer(multerConfig)

router.get("/points/:id", pointsController.show)
router.get("/points", pointsController.index)
router.post("/points", upload.single("image"), pointsController.create)

router.get("/foods", foodsController.index)

export default router