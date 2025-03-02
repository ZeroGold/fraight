import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">About Fraight</h1>
      <p className="mb-4">
        Fraight is a cutting-edge platform connecting drivers and distributors in the logistics industry. Our mission is
        to streamline the process of matching loads with reliable transportation, making shipping more efficient and
        cost-effective for everyone involved.
      </p>
      <h2 className="text-2xl font-semibold mb-2">Our Features</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Easy load browsing and acceptance for drivers</li>
        <li>Efficient load creation and management for distributors</li>
        <li>Real-time tracking and updates</li>
        <li>Secure payment processing</li>
        <li>Rating system for drivers and distributors</li>
      </ul>
      <p className="mb-4">
        Whether you're a driver looking for your next haul or a distributor needing to ship goods, Fraight has the tools
        and network to meet your needs.
      </p>
      <Link href="/register">
        <Button>Get Started with Fraight</Button>
      </Link>
    </div>
  )
}

