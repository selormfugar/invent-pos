import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SalesSummary } from "@/components/reports/sales-summary"
import { BestSellers } from "@/components/reports/best-sellers"
import { SalesChart } from "@/components/reports/sales-chart"
import { InvoiceList } from "@/components/reports/invoice-list"

export default function ReportsPage() {
  return (
    <div className="container mx-auto py-4">
      <Tabs defaultValue="sales">
        <TabsList className="mb-6">
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>

        <TabsContent value="sales">
          <SalesSummary />

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <BestSellers />
            <SalesChart />
          </div>
        </TabsContent>

        <TabsContent value="invoices">
          <InvoiceList />
        </TabsContent>
      </Tabs>
    </div>
  )
}

