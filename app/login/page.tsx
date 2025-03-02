"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Truck, Package } from "lucide-react"
import { loginUser } from "@/lib/actions"
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleLogin = async (role: string, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      formData.append("role", role)

      const result = await loginUser(formData)

      if (result?.error) {
        toast({
          title: "Login failed",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Login failed",
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
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Sign in to your account to continue</p>
        </div>
        <Tabs defaultValue="driver" className="w-full">
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
              <form onSubmit={(e) => handleLogin("driver", e)}>
                <CardHeader>
                  <CardTitle>Driver Login</CardTitle>
                  <CardDescription>Enter your credentials to access your driver account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="driver-email">Email</Label>
                    <Input id="driver-email" name="email" type="email" placeholder="driver@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="driver-password">Password</Label>
                      <Link href="/forgot-password" className="text-xs text-muted-foreground hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Input id="driver-password" name="password" type="password" required />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          <TabsContent value="distributor">
            <Card>
              <form onSubmit={(e) => handleLogin("distributor", e)}>
                <CardHeader>
                  <CardTitle>Distributor Login</CardTitle>
                  <CardDescription>Enter your credentials to access your distributor account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="distributor-email">Email</Label>
                    <Input
                      id="distributor-email"
                      name="email"
                      type="email"
                      placeholder="distributor@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="distributor-password">Password</Label>
                      <Link href="/forgot-password" className="text-xs text-muted-foreground hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Input id="distributor-password" name="password" type="password" required />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="underline underline-offset-4 hover:text-primary">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}

