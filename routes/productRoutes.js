const express = require("express")
const router = express.Router()
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

// GET all products
router.get("/", async (req, res) => {
  const products = await prisma.product.findMany()
  res.json(products)
})

// GET single product
router.get("/:id", async (req, res) => {
  const { id } = req.params

  const product = await prisma.product.findUnique({
    where: { id: Number(id) }
  })

  res.json(product)
})

// CREATE product
router.post("/", async (req, res) => {
  try {
    const { sku, name, price, stock, imageUrl, description, category, brand } = req.body

    const product = await prisma.product.create({
      data: {
        sku,
        name,
        price: Number(price),
        stock: Number(stock),
        imageUrl,
        description,
        category,
        brand
      }
    })

    res.json(product)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// UPDATE product
router.put("/:id", async (req, res) => {
  const { id } = req.params

  const updated = await prisma.product.update({
    where: { id: Number(id) },
    data: req.body
  })

  res.json(updated)
})

// DELETE product
router.delete("/:id", async (req, res) => {
  await prisma.product.delete({
    where: { id: Number(id) }
  })

  res.json({ message: "Deleted successfully" })
})

module.exports = router