"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getInvoices() {
  try {
    const invoices = await prisma.invoice.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })
    return { success: true, data: invoices }
  } catch (error) {
    console.error("Failed to fetch invoices:", error)
    return { success: false, error: "Failed to fetch invoices" }
  }
}

export async function createInvoice(formData: FormData) {
  try {
    const customer = formData.get("customer") as string
    const amount = Number.parseFloat(formData.get("amount") as string)
    const status = formData.get("status") as string

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        customer,
        amount,
        status,
      },
    })

    revalidatePath("/reports")
    return { success: true, data: invoice }
  } catch (error) {
    console.error("Failed to create invoice:", error)
    return { success: false, error: "Failed to create invoice" }
  }
}

export async function updateInvoiceStatus(id: number, status: string) {
  try {
    const invoice = await prisma.invoice.update({
      where: { id },
      data: { status },
    })

    revalidatePath("/reports")
    return { success: true, data: invoice }
  } catch (error) {
    console.error(`Failed to update invoice ${id}:`, error)
    return { success: false, error: `Failed to update invoice ${id}` }
  }
}

