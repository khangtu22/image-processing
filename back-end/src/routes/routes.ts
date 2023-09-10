import imageRouter from "./image/imageRouter"
import { Application } from "express-serve-static-core"
import {
  getAllStockImages,
  getAllTransformedImages,
  getImageStockByImageId,
  getImageThumbByImageId,
  redirectToIfAccessHomePage,
  uploadImage,
} from "../controllers/image/imageController"
import { upload } from "../utils/multerConfig"

export default function (app: Application): void {
  app.use("/api/image", imageRouter)

  app.get("/", redirectToIfAccessHomePage)

  app.get("/images", getAllStockImages)

  app.get("/transformed-images", getAllTransformedImages)

  app.post("/upload", upload.single("file"), uploadImage)

  app.get("/image/thumb", getImageThumbByImageId)

  app.get("/image/stock", getImageStockByImageId)
}
