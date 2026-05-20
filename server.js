const express = require("express")
const cors = require("cors")
const { PrismaClient } = require("@prisma/client")

const productRoutes = require("./routes/productRoutes")

const app = express()
const prisma = new PrismaClient()

// Middleware
app.use(cors())
app.use(express.json())

// Health check route
app.get("/", (req, res) => {
  res.send("Retail Ordering Backend Running 🚀")
})

// Product routes
app.use("/products", productRoutes)

// IMPORTANT FOR RENDER
const PORT = process.env.PORT || 5000

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on port ${PORT}`)
})