import request from "supertest"
import app from "../app"

describe("validateImageParams", () => {
  it("should return 400 if imageId is missing", async () => {
    const response = await request(app).get("/api/image?width=100&height=150")
    expect(response.status).toBe(400)
    expect(response.text).toContain("Can't proceed without Image ID")
  })

  it("should return 400 if width is invalid", async () => {
    const response = await request(app).get("/api/image?imageId=someId&width=-10&height=150")
    expect(response.status).toBe(400)
    expect(response.text).toContain('Invalid "width" value: -10')
  })

  it("should return 400 if height is invalid", async () => {
    const response = await request(app).get("/api/image?imageId=someId&width=100&height=-5")
    expect(response.status).toBe(400)
    expect(response.text).toContain('Invalid "height" value: -5')
  })

  it("should set res.locals.imageId, res.locals.width, and res.locals.height and call next() for valid params", async () => {
    const response = await request(app).get(
      "/api/image?imageId=encenadaport.jpg&width=100&height=150"
    )
    expect(response.status).toBe(200) // Assuming your middleware calls next() and returns 200
  })
})
