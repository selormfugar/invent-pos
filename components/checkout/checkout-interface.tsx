"use client"

import { useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { CartItem } from "@/components/checkout/cart-item"
import { PaymentOptions } from "@/components/checkout/payment-options"
import { usePOS } from "@/context/pos-context"
import { searchProducts } from "@/app/actions/product-actions"
import { toast } from "@/components/ui/use-toast"

export function CheckoutInterface() {
  const { cart, updateQuantity, addToCart } = usePOS()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleAddToCart = useCallback(
    (product: any) => {
      addToCart(product)
      setSearchResults([])
      setSearchQuery("")
    },
    [addToCart],
  )

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const result = await searchProducts(searchQuery)
      if (result.success) {
        setSearchResults(result.data)
      } else {
        toast({
          title: "Search Failed",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Search error:", error)
      toast({
        title: "Search Error",
        description: "Failed to search products",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const taxRate = 0.07
  const tax = subtotal * taxRate
  const total = subtotal + tax

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Scan barcode or search product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={isSearching}>
                <Search className="h-4 w-4 mr-2" />
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>

            {searchResults.length > 0 && (
              <div className="mt-4 border rounded-md">
                <div className="p-2 bg-muted font-medium">Search Results</div>
                <div className="divide-y">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      className="p-2 flex justify-between items-center hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleAddToCart(product)}
                    >
                      <div>
                        <div>{product.name}</div>
                        <div className="text-sm text-muted-foreground">SKU: {product.sku}</div>
                      </div>
                      <div className="font-medium">${product.price.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="bg-primary text-primary-foreground p-3 grid grid-cols-12 text-sm font-medium">
              <div className="col-span-6">Product</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-3 text-right">Price</div>
            </div>

            <div className="divide-y">
              {cart.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={(quantity) => updateQuantity(item.id, quantity)}
                />
              ))}
            </div>

            {cart.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No items in cart. Scan or search for products to add.
              </div>
            )}

            <div className="p-4 bg-muted/30">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Subtotal:</div>
                <div className="text-right">${subtotal.toFixed(2)}</div>

                <div>Tax ({(taxRate * 100).toFixed(0)}%):</div>
                <div className="text-right">${tax.toFixed(2)}</div>

                <div className="text-base font-bold pt-2 border-t">TOTAL:</div>
                <div className="text-right text-base font-bold pt-2 border-t">${total.toFixed(2)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <PaymentOptions total={total} />
      </div>
    </div>
  )
}

