"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Truck, Package, MapPin, Calendar, DollarSign, CheckCircle, Filter, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DashboardLayout from "@/components/dashboard-layout"

// Mock API functions
const mockApi = {
  // GET /api/driver/loads
  getAvailableLoads: async () => {
    // Simulating API call delay
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
        company: "ABC Distributors",
        isPerishable: true,
        expiryDate: "Mar 10, 2025",
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
        company: "Fresh Foods Inc.",
        isPerishable: true,
        expiryDate: "Mar 7, 2025",
      },
      // ... other loads
    ]
  },
  // GET /api/driver/active-loads
  getActiveLoads: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return [
      {
        id: "LD-7890",
        pickup: "Phoenix, AZ",
        delivery: "Las Vegas, NV",
        distance: "297 miles",
        weight: "17,500 lbs",
        type: "Dry Van",
        rate: "$720",
        pickupDate: "Mar 2, 2025",
        deliveryDate: "Mar 3, 2025",
        status: "In Transit",
        company: "Desert Shipping Co.",
        isPerishable: false,
        expiryDate: null,
      },
    ]
  },
  // POST /api/driver/loads/:id/accept
  acceptLoad: async (loadId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return { success: true, message: "Load accepted successfully" }
  },
  // POST /api/driver/loads/:id/deliver
  markAsDelivered: async (loadId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return { success: true, message: "Load marked as delivered" }
  },
  // GET /api/driver/stats
  getDriverStats: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return {
      weeklyEarnings: 1420,
      totalMiles: 1245,
    }
  },
}

export default function DriverDashboard() {
  const [loads, setLoads] = useState([])
  const [activeLoads, setActiveLoads] = useState([])
  const [stats, setStats] = useState({ weeklyEarnings: 0, totalMiles: 0 })
  const [activeTab, setActiveTab] = useState("available")

  useEffect(() => {
    // Fetch available loads
    mockApi.getAvailableLoads().then(setLoads)
    // Fetch active loads
    mockApi.getActiveLoads().then(setActiveLoads)
    // Fetch driver stats
    mockApi.getDriverStats().then(setStats)
  }, [])

  const acceptLoad = async (loadId: string) => {
    try {
      await mockApi.acceptLoad(loadId)
      // Move the accepted load from available to active
      const acceptedLoad = loads.find((load) => load.id === loadId)
      if (acceptedLoad) {
        setActiveLoads([...activeLoads, { ...acceptedLoad, status: "In Transit" }])
        setLoads(loads.filter((load) => load.id !== loadId))
      }
      // Refresh driver stats
      const newStats = await mockApi.getDriverStats()
      setStats(newStats)
    } catch (error) {
      console.error("Failed to accept load:", error)
      // Handle error (e.g., show error message to user)
    }
  }

  const markAsDelivered = async (loadId: string) => {
    try {
      await mockApi.markAsDelivered(loadId)
      // Remove the delivered load from active loads
      setActiveLoads(activeLoads.filter((load) => load.id !== loadId))
      // Refresh driver stats
      const newStats = await mockApi.getDriverStats()
      setStats(newStats)
    } catch (error) {
      console.error("Failed to mark load as delivered:", error)
      // Handle error (e.g., show error message to user)
    }
  }

  return (
    <DashboardLayout userType="driver">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Driver Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Avatar" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-muted-foreground">Driver</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Loads</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loads.length}</div>
              <p className="text-xs text-muted-foreground">+2 from yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Loads</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeLoads.length}</div>
              <p className="text-xs text-muted-foreground">-1 from yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weekly Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.weeklyEarnings}</div>
              <p className="text-xs text-muted-foreground">+$350 from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Miles</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMiles}</div>
              <p className="text-xs text-muted-foreground">+297 from last week</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="available" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Available Loads
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              My Active Loads
            </TabsTrigger>
          </TabsList>
          <TabsContent value="available" className="space-y-4">
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
                    <SelectValue placeholder="Load Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="dry-van">Dry Van</SelectItem>
                    <SelectItem value="refrigerated">Refrigerated</SelectItem>
                    <SelectItem value="flatbed">Flatbed</SelectItem>
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
                      <Badge variant="outline">{load.type}</Badge>
                    </div>
                    <CardDescription>{load.company}</CardDescription>
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
                      <div className="grid grid-cols-2 gap-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Perishable:</span>
                        </div>
                        <div className="text-sm">{load.isPerishable ? "Yes" : "No"}</div>
                      </div>
                      {load.isPerishable && (
                        <div className="grid grid-cols-2 gap-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Expiry Date:</span>
                          </div>
                          <div className="text-sm">{load.expiryDate}</div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button className="w-full" onClick={() => acceptLoad(load.id)}>
                      Accept Load
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="active" className="space-y-4">
            {activeLoads.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>No Active Loads</CardTitle>
                  <CardDescription>
                    You don't have any active loads at the moment. Browse available loads to find your next delivery.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="outline" onClick={() => setActiveTab("available")}>
                    Browse Available Loads
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {activeLoads.map((load) => (
                  <Card key={load.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle>{load.id}</CardTitle>
                        <Badge variant="secondary">{load.status}</Badge>
                      </div>
                      <CardDescription>{load.company}</CardDescription>
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
                        <div className="grid grid-cols-2 gap-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Perishable:</span>
                          </div>
                          <div className="text-sm">{load.isPerishable ? "Yes" : "No"}</div>
                        </div>
                        {load.isPerishable && (
                          <div className="grid grid-cols-2 gap-1">
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">Expiry Date:</span>
                            </div>
                            <div className="text-sm">{load.expiryDate}</div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <Button variant="outline" className="w-full" onClick={() => markAsDelivered(load.id)}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark as Delivered
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}


