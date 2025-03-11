import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const bestSellingProducts = [
  { id: 1, name: "Organic Apples", unitsSold: 42 },
  { id: 2, name: "Whole Milk 1gal", unitsSold: 36 },
  { id: 3, name: "Wheat Bread", unitsSold: 29 },
  { id: 4, name: "Organic Bananas", unitsSold: 24 },
  { id: 5, name: "Free Range Eggs", unitsSold: 18 },
]

export function BestSellers() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Best-Selling Products</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Units Sold</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bestSellingProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="text-right">{product.unitsSold}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

