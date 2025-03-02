"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Truck, Package } from "lucide-react"
import { registerUser } from "@/lib/actions"
import { useToast } from "@/components/ui/use-toast"

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("driver")
  const { toast } = useToast()

  useEffect(() => {
    const role = searchParams.get("role")
    if (role === "driver" || role === "distributor") {
      setActiveTab(role)
    }
  }, [searchParams])

  const handleRegister = async (role: string, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      formData.append("role", role)

      const result = await registerUser(formData)

      if (result?.error) {
        toast({
          title: "Registration failed",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">Sign up to start using Fraight</p>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="driver" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Driver
            </TabsTrigger>
            <TabsTrigger value="distributor" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Distributor
            </TabsTrigger>
          </TabsList>
          <TabsContent value="driver">
            <Card>
              <form onSubmit={(e) => handleRegister("driver", e)}>
                <CardHeader>
                  <CardTitle>Driver Registration</CardTitle>
                  <CardDescription>Create a driver account to find and accept loads</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="driver-first-name">First name</Label>
                      <Input id="driver-first-name" name="firstName" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="driver-last-name">Last name</Label>
                      <Input id="driver-last-name" name="lastName" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="driver-email">Email</Label>
                    <Input id="driver-email" name="email" type="email" placeholder="driver@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="driver-phone">Phone number</Label>
                    <Input id="driver-phone" name="phone" type="tel" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="driver-password">Password</Label>
                    <Input id="driver-password" name="password" type="password" required />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create account"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          <TabsContent value="distributor">
            <Card>
              <form onSubmit={(e) => handleRegister("distributor", e)}>
                <CardHeader>
                  <CardTitle>Distributor Registration</CardTitle>
                  <CardDescription>Create a distributor account to post loads</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company name</Label>
                    <Input id="company-name" name="companyName" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="distributor-email">Email</Label>
                    <Input
                      id="distributor-email"
                      name="email"
                      type="email"
                      placeholder="company@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="distributor-phone">Phone number</Label>
                    <Input id="distributor-phone" name="phone" type="tel" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="distributor-address">Business address</Label>
                    <Input id="distributor-address" name="address" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="distributor-password">Password</Label>
                    <Input id="distributor-password" name="password" type="password" required />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create account"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline underline-offset-4 hover:text-primary">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

