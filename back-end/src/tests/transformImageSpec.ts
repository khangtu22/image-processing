import request from "supertest"
import app from "../app"
import { transform } from "../controllers/image/imageController"

describe("Transform Image", () => {
  it("should return 400 if imageId is missing", async () => {
    const response = await request(app).get("/api/images?width=100&height=150")
    expect(response.status).toBe(400)
    expect(response.text).toContain("Can't proceed without Image ID")
  })

  it("should return 400 if width is invalid", async () => {
    const response = await request(app).get("/api/images?imageId=someId&width=-10&height=150")
    expect(response.status).toBe(400)
    expect(response.text).toContain('Invalid "width" value: -10')
  })

  it("should return 400 if height is invalid", async () => {
    const response = await request(app).get("/api/images?imageId=someId&width=100&height=-5")
    expect(response.status).toBe(400)
    expect(response.text).toContain('Invalid "height" value: -5')
  })

  it("should set res.locals.imageId, res.locals.width, and res.locals.height and call next() for valid params", async () => {
    const response = await request(app).get(
      "/api/images?imageId=encenadaport.jpg&width=100&height=150"
    )
    expect(response.status).toBe(200) // Assuming your middleware calls next() and returns 200
  })
})

describe("transform", () => {
  it("should resize the image and return a Buffer of the resized image file", async () => {
    const inputFile = "fjord.jpg"
    const width = 300
    const height = 200

    const transformedImage = await transform(inputFile, width, height)

    expect(transformedImage instanceof Buffer).toBe(true)
    expect(transformedImage.length).toBeGreaterThan(0)
  })

  it("should resize the image with a unique filename if the output file already exists", async () => {
    const inputFile = "fjord.jpg"
    const width = 300
    const height = 200

    const transformedImage = await transform(inputFile, width, height)

    expect(transformedImage instanceof Buffer).toBe(true)
    expect(transformedImage.length).toBeGreaterThan(0)
  })

  it("should throw an error if there is an error resizing the image", async () => {
    const inputFile = "nonexistent.jpg"
    const width = 300
    const height = 200

    await expectAsync(transform(inputFile, width, height)).toBeRejected()
  })
})
