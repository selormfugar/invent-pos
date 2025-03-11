"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, DollarSign, FileText } from "lucide-react"
import { usePOS } from "@/context/pos-context"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"

interface PaymentOptionsProps {
  total: number
}

export function PaymentOptions({ total }: PaymentOptionsProps) {
  const { checkout, cart, isOnline } = usePOS()
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayment = async (method: string) => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to the cart before checkout",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      const result = await checkout(method)

      if (result.success) {
        if (result.offline) {
          toast({
            title: "Offline Order Saved",
            description: "Order has been saved and will sync when you're back online",
          })
        } else {
          toast({
            title: "Order Completed",
            description: `Payment of $${total.toFixed(2)} processed successfully`,
          })
        }
      } else {
        toast({
          title: "Checkout Failed",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Checkout Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button
          size="lg"
          className="h-16 text-lg justify-start"
          onClick={() => handlePayment("Cash")}
          disabled={isProcessing}
        >
          <DollarSign className="mr-2 h-5 w-5" />
          Cash
        </Button>

        <Button
          size="lg"
          className="h-16 text-lg justify-start bg-green-600 hover:bg-green-700"
          onClick={() => handlePayment("Card")}
          disabled={isProcessing || !isOnline}
        >
          <CreditCard className="mr-2 h-5 w-5" />
          Card
          {!isOnline && <span className="ml-2 text-xs">(Requires online)</span>}
        </Button>

        <Button
          size="lg"
          className="h-16 text-lg justify-start bg-purple-600 hover:bg-purple-700"
          onClick={() => handlePayment("Invoice")}
          disabled={isProcessing}
        >
          <FileText className="mr-2 h-5 w-5" />
          Invoice
        </Button>

        <div className="flex-1 min-h-[100px]"></div>

        <Button
          size="lg"
          className="h-16 text-lg bg-red-600 hover:bg-red-700"
          onClick={() => handlePayment("Cash")}
          disabled={isProcessing || cart.length === 0}
        >
          {isProcessing ? "PROCESSING..." : "CHECKOUT"}
        </Button>
      </CardContent>
    </Card>
  )
}

