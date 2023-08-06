import { Router } from "express"
import imageParams from "../../middlewares/imageParams"
import { resizeImage } from "../../controllers/image/imageController"

const router = Router()

router.get("/", imageParams.validateImageParams, resizeImage)

export default router
