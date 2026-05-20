const xlsx = require("xlsx")
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function importProducts() {
  try {
    // Read Excel file
    const workbook = xlsx.readFile("products.xlsx")

    // Get first sheet
    const sheetName = workbook.SheetNames[0]

    // Convert sheet to JSON
    const products = xlsx.utils.sheet_to_json(
      workbook.Sheets[sheetName]
    )

    console.log(products)

    // Insert into database
    for (const product of products) {
      await prisma.product.upsert({
  where: {
    sku: product.sku
  },
  update: {
    name: product.name,
    description: product.description,
    price: Number(product.price),
    stock: Number(product.stock),
    imageUrl: product.imageUrl,
    category: product.category,
    brand: product.brand,
  },
  create: {
    sku: product.sku,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    stock: Number(product.stock),
    imageUrl: product.imageUrl,
    category: product.category,
    brand: product.brand,
  }
  })
    }

    console.log("Products imported successfully 🚀")
  } catch (err) {
    console.error(err)
  } finally {
    await prisma.$disconnect()
  }
}

importProducts()