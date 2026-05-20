const express = require("express")
const router = express.Router()
const multer = require("multer")
const fs = require("fs")

const { PrismaClient } = require("@prisma/client")
const cloudinary = require("../lib/cloudinary")

const prisma = new PrismaClient()

const upload = multer({ dest: "uploads/" })

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    res.json(products)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// CREATE product
router.post("/", async (req, res) => {
  try {
    const product = await prisma.product.create({
      data: {
        sku: req.body.sku,
        name: req.body.name,
        price: Number(req.body.price),
        stock: Number(req.body.stock),
        imageUrl: req.body.imageUrl || null,
        category: req.body.category || null,
        distributor: req.body.distributor || null,
        brand: req.body.brand || null,
      },
    })

    res.json(product)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// UPDATE product
router.put("/:id", async (req, res) => {
  try {
    const product = await prisma.product.update({
      where: {
        id: Number(req.params.id),
      },
      data: req.body,
    })

    res.json(product)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// UPDATE product image from backend/admin upload
router.put("/:id/image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No image uploaded",
      })
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "retail-products",
    })

    fs.unlinkSync(req.file.path)

    const product = await prisma.product.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        imageUrl: result.secure_url,
      },
    })

    res.json(product)
  } catch (err) {
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path)
    }

    res.status(500).json({
      error: err.message,
    })
  }
})

// DELETE product
router.delete("/:id", async (req, res) => {
  try {
    await prisma.product.delete({
      where: {
        id: Number(req.params.id),
      },
    })

    res.json({ message: "Product deleted successfully" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router