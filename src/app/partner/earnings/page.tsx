
"use client"

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { partnerNavItems, type Earning } from "@/lib/data";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { ChartTooltipContent, ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart";

const chartConfig = {
  total: {
    label: "Total",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const earningsData: Earning[] = [
  { month: "Jan", total: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Feb", total: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Mar", total: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Apr", total: Math.floor(Math.random() * 5000) + 1000 },
  { month: "May", total: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Jun", total: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Jul", total: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Aug", total: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Sep", total: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Oct", total: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Nov", total: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Dec", total: Math.floor(Math.random() * 5000) + 1000 },
];

export default function PartnerEarningsPage() {
  const totalEarnings = earningsData.reduce((acc, curr) => acc + curr.total, 0);

  return (
    <AppShell navItems={partnerNavItems} userType="partner">
      <div className="grid gap-6">
        <h1 className="text-3xl font-bold">Earnings</h1>
        <div className="grid md:grid-cols-3 gap-6">
            <Card>
                <CardHeader>
                    <CardDescription>Total Earnings</CardDescription>
                    <CardTitle>₹{totalEarnings.toLocaleString()}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button className="w-full">Withdraw</Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardDescription>This Month</CardDescription>
                    <CardTitle>₹{(earningsData[new Date().getMonth()]?.total || 0).toLocaleString()}</CardTitle>
                </CardHeader>
            </Card>
             <Card>
                <CardHeader>
                    <CardDescription>Completed Jobs</CardDescription>
                    <CardTitle>128</CardTitle>
                </CardHeader>
            </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Report</CardTitle>
            <CardDescription>Your earnings over the last 12 months.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full h-[300px]">
              <BarChart accessibilityLayer data={earningsData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${value}`}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="total" fill="var(--color-total)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>2023-08-15</TableCell>
                  <TableCell>Plumbing Service #12345</TableCell>
                  <TableCell className="text-right text-green-500">+₹45.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2023-08-14</TableCell>
                  <TableCell>Withdrawal to Bank</TableCell>
                  <TableCell className="text-right text-red-500">-₹500.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2023-08-12</TableCell>
                  <TableCell>Electrician Service #12342</TableCell>
                  <TableCell className="text-right text-green-500">+₹75.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
