"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        name: "asc",
      },
    })
    return { success: true, data: products }
  } catch (error) {
    console.error("Failed to fetch products:", error)
    return { success: false, error: "Failed to fetch products" }
  }
}

export async function getProduct(id: number) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    })
    return { success: true, data: product }
  } catch (error) {
    console.error(`Failed to fetch product ${id}:`, error)
    return { success: false, error: `Failed to fetch product ${id}` }
  }
}

export async function createProduct(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const sku = formData.get("sku") as string
    const description = formData.get("description") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const inStock = Number.parseInt(formData.get("inStock") as string)
    const minStock = Number.parseInt(formData.get("minStock") as string)

    const product = await prisma.product.create({
      data: {
        name,
        sku,
        description,
        price,
        inStock,
        minStock,
      },
    })

    revalidatePath("/inventory")
    return { success: true, data: product }
  } catch (error) {
    console.error("Failed to create product:", error)
    return { success: false, error: "Failed to create product" }
  }
}

export async function updateProduct(id: number, formData: FormData) {
  try {
    const name = formData.get("name") as string
    const sku = formData.get("sku") as string
    const description = formData.get("description") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const inStock = Number.parseInt(formData.get("inStock") as string)
    const minStock = Number.parseInt(formData.get("minStock") as string)

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        sku,
        description,
        price,
        inStock,
        minStock,
      },
    })

    revalidatePath("/inventory")
    return { success: true, data: product }
  } catch (error) {
    console.error(`Failed to update product ${id}:`, error)
    return { success: false, error: `Failed to update product ${id}` }
  }
}

export async function deleteProduct(id: number) {
  try {
    await prisma.product.delete({
      where: { id },
    })

    revalidatePath("/inventory")
    return { success: true }
  } catch (error) {
    console.error(`Failed to delete product ${id}:`, error)
    return { success: false, error: `Failed to delete product ${id}` }
  }
}

export async function searchProducts(query: string) {
  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [{ name: { contains: query } }, { sku: { contains: query } }, { description: { contains: query } }],
      },
      orderBy: {
        name: "asc",
      },
    })
    return { success: true, data: products }
  } catch (error) {
    console.error("Failed to search products:", error)
    return { success: false, error: "Failed to search products" }
  }
}

