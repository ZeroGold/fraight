import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Package, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Truck className="h-6 w-6" />
          <span>Fraight</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4">
            Log In
          </Link>
          <Link href="/register" className="text-sm font-medium hover:underline underline-offset-4">
            Register
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Connecting Drivers and Distributors
                </h1>
                <p className="text-muted-foreground md:text-xl">
                  Fraight makes it easy for drivers to find loads and for distributors to find reliable transportation.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Link href="/register">
                    <Button size="lg">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button variant="outline" size="lg">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <Card>
                  <CardHeader>
                    <Truck className="h-10 w-10 text-primary" />
                    <CardTitle className="mt-4">For Drivers</CardTitle>
                    <CardDescription>Find and accept loads that match your route and vehicle.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid gap-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span>Browse available loads</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span>Accept loads with one click</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span>Track earnings and history</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Link href="/register?role=driver" className="w-full">
                      <Button className="w-full">Register as Driver</Button>
                    </Link>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <Package className="h-10 w-10 text-primary" />
                    <CardTitle className="mt-4">For Distributors</CardTitle>
                    <CardDescription>Create and manage loads for quick delivery.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid gap-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span>Create load listings</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span>Track shipment status</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span>Manage payment details</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Link href="/register?role=distributor" className="w-full">
                      <Button className="w-full">Register as Distributor</Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">© 2025 Fraight. All rights reserved.</p>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="/terms" className="text-sm font-medium hover:underline underline-offset-4">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm font-medium hover:underline underline-offset-4">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

