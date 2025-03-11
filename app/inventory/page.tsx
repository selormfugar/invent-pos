import { InventoryList } from "@/components/inventory/inventory-list"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function InventoryPage() {
  return (
    <div className="container mx-auto py-4">
      <h1 className="text-2xl font-bold mb-6">Inventory Management</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search inventory..." className="pl-9" />
        </div>
      </div>

      <InventoryList />
    </div>
  )
}

