const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  try {
    // Make a request to our seed API route
    const response = await fetch("http://localhost:3000/api/seed")
    const data = await response.json()

    console.log("Seed result:", data)
  } catch (error) {
    console.error("Seed error:", error)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

