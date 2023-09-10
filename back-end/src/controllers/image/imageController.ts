import fs from "fs"
import path from "path"
import sizeOf from "image-size"
import {
  IMAGE_STOCK_LOCATION,
  IMAGE_THUMB_LOCATION,
  SHORT_PATH_TO_STOCK,
  SHORT_PATH_TO_THUMB,
} from "../../utils/imageUtils"
import { NextFunction, Request, Response } from "express"
import sharp from "sharp"

export const getAllTransformedImages = (req: Request, res: Response): void => {
  fs.readdir(IMAGE_THUMB_LOCATION, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Error reading the images folder." })
    }

    const imageFiles = files.filter((file) => {
      const fileExtension = path.extname(file).toLowerCase()
      return [".jpg", ".jpeg", ".png", ".gif"].includes(fileExtension)
    })

    const imageDetails = imageFiles.map((file) => {
      const imagePath = path.join(IMAGE_THUMB_LOCATION, file)
      const dimensions = sizeOf(imagePath) // Get the dimensions (width and height) of the image
      const { size, mtime } = fs.statSync(imagePath) // Get the size of the image in bytes
      return {
        id: file,
        url: file,
        width: dimensions.width,
        height: dimensions.height,
        sizeInBytes: size,
        dateEdited: mtime,
      }
    })
    res.json({ images: imageDetails })
  })
}

export const getAllStockImages = (req: Request, res: Response): void => {
  fs.readdir(IMAGE_STOCK_LOCATION, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Error reading the images folder." })
    }

    const imageFiles = files.filter((file) => {
      const fileExtension = path.extname(file).toLowerCase()
      return [".jpg", ".jpeg", ".png", ".gif"].includes(fileExtension)
    })

    const imageDetails = imageFiles.map((file) => {
      const imagePath = path.join(IMAGE_STOCK_LOCATION, file)
      const dimensions = sizeOf(imagePath) // Get the dimensions (width and height) of the image
      const { size, mtime } = fs.statSync(imagePath) // Get the size of the image in bytes
      return {
        id: file,
        url: file,
        width: dimensions.width,
        height: dimensions.height,
        sizeInBytes: size,
        dateEdited: mtime,
      }
    })
    res.json({ images: imageDetails })
  })
}

export const showHomePage = (req: Request, res: Response): void => {
  res.send(`
  <div style="font-family: Arial, sans-serif; text-align: center;">
    <h1 style="color: #333;">Welcome to the Image Processing API</h1>
    <p style="font-size: 18px;">To use this API, send a query to <code>/api/images</code> with a valid filename.</p>
    <h2 style="color: #666; margin-top: 40px;">Examples:</h2>
    <ul style="list-style: none; padding: 0; margin-top: 20px;">
      <li style="margin-bottom: 10px;">
        <a href="/api/images?imageId=fjord.jpg&width=120&height=120" style="text-decoration: none; color: #337ab7;">/api/images?imageId=fjord.jpg&width=100&height=100</a>
      </li>
    </ul>
  </div>
`)
}

export const uploadImage = (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" })
    return
  }

  const filename = Date.now() + req.file.originalname
  fs.renameSync(req.file.path, path.join("assets/full/", filename))

  res.json({ message: "File uploaded successfully" })
}

export const getImageThumbByImageId = (req: Request, res: Response): void => {
  const imageName = req.query.imageId as string
  const imagePathInThumb = path.join(IMAGE_THUMB_LOCATION, imageName) // Replace with the path to your image file
  const imageStream = fs.createReadStream(imagePathInThumb)
  res.setHeader("Content-Type", "image/jpeg")
  res.setHeader("Content-Disposition", 'inline; filename="image.jpg"') // Change the filename if needed
  imageStream.pipe(res)
}

export const getImageStockByImageId = (req: Request, res: Response): void => {
  const imageName = req.query.imageId as string
  const imagePathInStock = path.join(IMAGE_STOCK_LOCATION, imageName) // Replace with the path to your image file
  const imageStream = fs.createReadStream(imagePathInStock)
  res.setHeader("Content-Type", "image/jpeg")
  res.setHeader("Content-Disposition", 'inline; filename="image.jpg"') // Change the filename if needed
  imageStream.pipe(res)
}

export const redirectToIfAccessHomePage = (req: Request, res: Response): void => {
  const redirectUrl = new URL("/api/image", `http://${req.get("host")}`)
  res.redirect(redirectUrl.toString())
}

export const resizeImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const width: number = parseInt(req.query.width as string, 10)
  const height: number = parseInt(req.query.height as string, 10)
  const inputFile: string = req.query.imageId as string

  // Validate imageId
  if (!inputFile) {
    res.status(400).send("Can't proceed without Image ID")
    return
  }

  // Validate width
  if (req.query.width && isNaN(width)) {
    res.status(400).send(`Invalid "width" value: ${req.query.width}`)
    return
  }

  // Validate height
  if (req.query.height && isNaN(height)) {
    res.status(400).send(`Invalid "height" value: ${req.query.height}`)
    return
  }

  // Check for missing width or height
  if ((!req.query.width && req.query.height) || (req.query.width && !req.query.height)) {
    res.status(400).send('Both "width" and "height" must be provided')
    return
  }

  // Check if width and height are positive numbers
  if (width <= 0 || height <= 0) {
    res.status(400).send("Width and height must be positive numbers")
    return
  }

  try {
    const resizedImageFile = await transform(inputFile, width, height)
    res.status(200)
    res.setHeader("Content-Type", "image/jpeg")
    res.send(resizedImageFile)
    next()
  } catch (err) {
    res.status(500).json({ message: "Error resizing image." })
  }
}

export const transform = async (
  inputFile: string,
  width: number,
  height: number
): Promise<Buffer> => {
  const inputFilePath = path.join(SHORT_PATH_TO_STOCK, inputFile)
  const outputFile = `${inputFile.split(".")[0]}_${width}x${height}.${inputFile.split(".")[1]}`
  let outputFilePath = path.join(SHORT_PATH_TO_THUMB, outputFile)

  // Check if the output file exists, if it does, modify the filename to make it unique
  let counter = 1
  while (fs.existsSync(outputFilePath)) {
    const fileNameWithoutExt = `${inputFile.split(".")[0]}_${width}x${height}_${counter}`
    outputFilePath = path.join(
      SHORT_PATH_TO_THUMB,
      `${fileNameWithoutExt}.${inputFile.split(".")[1]}`
    )
    counter++
  }

  await sharp(inputFilePath).resize(width, height).toFile(outputFilePath)
  return fs.readFileSync(outputFilePath)
}
