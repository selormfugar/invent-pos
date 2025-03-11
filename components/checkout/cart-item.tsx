"use client"

import { Button } from "@/components/ui/button"
import { Minus, Plus } from "lucide-react"

interface Item {
  id: number
  name: string
  price: number
  quantity: number
}

interface CartItemProps {
  item: Item
  onUpdateQuantity: (quantity: number) => void
}

export function CartItem({ item, onUpdateQuantity }: CartItemProps) {
  return (
    <div className="p-3 grid grid-cols-12 items-center">
      <div className="col-span-6">{item.name}</div>
      <div className="col-span-3 flex justify-center items-center">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-r-none"
            onClick={() => onUpdateQuantity(item.quantity - 1)}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <div className="h-8 px-3 flex items-center justify-center border-y">{item.quantity}</div>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-l-none"
            onClick={() => onUpdateQuantity(item.quantity + 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="col-span-3 text-right">${(item.price * item.quantity).toFixed(2)}</div>
    </div>
  )
}

