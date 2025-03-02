"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Truck, Package, MapPin, Calendar, DollarSign, CheckCircle, Filter, Search, PlusCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DashboardLayout from "@/components/dashboard-layout"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Mock API functions
const mockApi = {
  // GET /api/distributor/loads
  getLoads: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return [
      {
        id: "LD-1234",
        pickup: "Los Angeles, CA",
        delivery: "San Francisco, CA",
        distance: "382 miles",
        weight: "15,000 lbs",
        type: "Dry Van",
        rate: "$950",
        pickupDate: "Mar 5, 2025",
        deliveryDate: "Mar 6, 2025",
        status: "Pending",
        driver: null,
      },
      {
        id: "LD-5678",
        pickup: "Seattle, WA",
        delivery: "Portland, OR",
        distance: "174 miles",
        weight: "22,000 lbs",
        type: "Refrigerated",
        rate: "$750",
        pickupDate: "Mar 4, 2025",
        deliveryDate: "Mar 4, 2025",
        status: "Assigned",
        driver: "Mike Johnson",
      },
      // ... other loads
    ]
  },
  // GET /api/distributor/completed-loads
  getCompletedLoads: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return [
      {
        id: "LD-3456",
        pickup: "Dallas, TX",
        delivery: "Houston, TX",
        distance: "239 miles",
        weight: "24,000 lbs",
        type: "Dry Van",
        rate: "$680",
        pickupDate: "Feb 28, 2025",
        deliveryDate: "Mar 1, 2025",
        status: "Completed",
        driver: "Sarah Williams",
      },
      {
        id: "LD-7890",
        pickup: "Phoenix, AZ",
        delivery: "Las Vegas, NV",
        distance: "297 miles",
        weight: "17,500 lbs",
        type: "Dry Van",
        rate: "$720",
        pickupDate: "Feb 25, 2025",
        deliveryDate: "Feb 26, 2025",
        status: "Completed",
        driver: "John Smith",
      },
    ]
  },
  // POST /api/distributor/loads
  createLoad: async (loadData) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return {
      id: `LD-${Math.floor(1000 + Math.random() * 9000)}`,
      ...loadData,
      status: "Pending",
      driver: null,
    }
  },
  // GET /api/distributor/stats
  getDistributorStats: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return {
      activeLoads: 3,
      assignedLoads: 1,
      monthlySpend: 3920,
      completedLoads: 2,
    }
  },
}

export default function DistributorDashboard() {
  const [loads, setLoads] = useState([])
  const [completed, setCompleted] = useState([])
  const [stats, setStats] = useState({ activeLoads: 0, assignedLoads: 0, monthlySpend: 0, completedLoads: 0 })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    // Fetch active loads
    mockApi.getLoads().then(setLoads)
    // Fetch completed loads
    mockApi.getCompletedLoads().then(setCompleted)
    // Fetch distributor stats
    mockApi.getDistributorStats().then(setStats)
  }, [])

  const createLoad = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsDialogOpen(false)

    // In a real app, you would collect form data here
    const newLoadData = {
      pickup: "New York, NY",
      delivery: "Boston, MA",
      distance: "215 miles",
      weight: "16,500 lbs",
      type: "Dry Van",
      rate: "$780",
      pickupDate: "Mar 10, 2025",
      deliveryDate: "Mar 11, 2025",
    }

    try {
      const newLoad = await mockApi.createLoad(newLoadData)
      setLoads([newLoad, ...loads])
      // Refresh stats
      const newStats = await mockApi.getDistributorStats()
      setStats(newStats)
    } catch (error) {
      console.error("Failed to create load:", error)
      // Handle error (e.g., show error message to user)
    }
  }

  return (
    <DashboardLayout userType="distributor">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Distributor Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Avatar" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Acme Distributors</p>
              <p className="text-xs text-muted-foreground">Distributor</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Loads</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeLoads}</div>
              <p className="text-xs text-muted-foreground">+1 from yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assigned Loads</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.assignedLoads}</div>
              <p className="text-xs text-muted-foreground">Same as yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Spend</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.monthlySpend}</div>
              <p className="text-xs text-muted-foreground">+$720 from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Loads</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedLoads}</div>
              <p className="text-xs text-muted-foreground">+2 from last week</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Manage Loads</h3>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Create New Load
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <form onSubmit={createLoad}>
                <DialogHeader>
                  <DialogTitle>Create New Load</DialogTitle>
                  <DialogDescription>
                    Fill in the details below to create a new load for drivers to accept.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pickup-location">Pickup Location</Label>
                      <Input id="pickup-location" placeholder="City, State" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="delivery-location">Delivery Location</Label>
                      <Input id="delivery-location" placeholder="City, State" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pickup-date">Pickup Date</Label>
                      <Input id="pickup-date" type="date" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="delivery-date">Delivery Date</Label>
                      <Input id="delivery-date" type="date" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (lbs)</Label>
                      <Input id="weight" type="number" placeholder="15000" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="load-type">Load Type</Label>
                      <Select defaultValue="dry-van">
                        <SelectTrigger id="load-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dry-van">Dry Van</SelectItem>
                          <SelectItem value="refrigerated">Refrigerated</SelectItem>
                          <SelectItem value="flatbed">Flatbed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rate">Rate ($)</Label>
                      <Input id="rate" type="number" placeholder="800" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="distance">Distance (miles)</Label>
                      <Input id="distance" type="number" placeholder="250" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="special-instructions">Special Instructions</Label>
                    <Textarea
                      id="special-instructions"
                      placeholder="Any special requirements or notes for the driver"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Create Load</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Active Loads
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Completed Loads
            </TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Input type="search" placeholder="Search loads..." className="flex-1" />
                <Button type="submit" size="icon" variant="ghost">
                  <Search className="h-4 w-4" />
                  <span className="sr-only">Search</span>
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filter</span>
                </Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {loads.map((load) => (
                <Card key={load.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle>{load.id}</CardTitle>
                      <Badge variant={load.status === "Assigned" ? "secondary" : "outline"}>{load.status}</Badge>
                    </div>
                    <CardDescription>{load.driver ? `Driver: ${load.driver}` : "No driver assigned"}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid gap-2">
                      <div className="grid grid-cols-2 gap-1">
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Pickup:</span>
                        </div>
                        <div className="text-sm">{load.pickup}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Delivery:</span>
                        </div>
                        <div className="text-sm">{load.delivery}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Pickup Date:</span>
                        </div>
                        <div className="text-sm">{load.pickupDate}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Delivery Date:</span>
                        </div>
                        <div className="text-sm">{load.deliveryDate}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Weight:</span>
                        </div>
                        <div className="text-sm">{load.weight}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="flex items-center gap-1 text-sm">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Rate:</span>
                        </div>
                        <div className="text-sm font-bold">{load.rate}</div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button variant="outline" className="w-full">
                      Edit Load
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="completed" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Input type="search" placeholder="Search completed loads..." className="flex-1" />
                <Button type="submit" size="icon" variant="ghost">
                  <Search className="h-4 w-4" />
                  <span className="sr-only">Search</span>
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="this-week">This Week</SelectItem>
                    <SelectItem value="this-month">This Month</SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filter</span>
                </Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {completed.map((load) => (
                <Card key={load.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle>{load.id}</CardTitle>
                      <Badge variant="success">Completed</Badge>
                    </div>
                    <CardDescription>Driver: {load.driver}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid gap-2">
                      <div className="grid grid-cols-2 gap-1">
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Pickup:</span>
                        </div>
                        <div className="text-sm">{load.pickup}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Delivery:</span>
                        </div>
                        <div className="text-sm">{load.delivery}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Delivery Date:</span>
                        </div>
                        <div className="text-sm">{load.deliveryDate}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="flex items-center gap-1 text-sm">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Rate:</span>
                        </div>
                        <div className="text-sm font-bold">{load.rate}</div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

