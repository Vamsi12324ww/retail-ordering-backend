require("dotenv").config()

const express = require("express")
const cors = require("cors")
const { PrismaClient } = require("@prisma/client")

const productRoutes = require("./routes/productRoutes")

const app = express()
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Retail Ordering Backend Running 🚀")
})

app.get("/health", async (req, res) => {
  try {
    await prisma.$connect()
    res.json({
      status: "ok",
      database: "connected",
    })
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    })
  }
})

app.use("/products", productRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on port ${PORT}`)
})