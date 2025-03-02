import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hash } from "bcrypt"

export async function GET() {
  try {
    // Create demo users
    const driverPassword = await hash("password123", 10)
    const distributorPassword = await hash("password123", 10)

    const driver = await prisma.user.upsert({
      where: { email: "driver@example.com" },
      update: {},
      create: {
        email: "driver@example.com",
        password: driverPassword,
        firstName: "John",
        lastName: "Doe",
        phone: "555-123-4567",
        role: "DRIVER",
      },
    })

    const distributor = await prisma.user.upsert({
      where: { email: "distributor@example.com" },
      update: {},
      create: {
        email: "distributor@example.com",
        password: distributorPassword,
        companyName: "Acme Distributors",
        phone: "555-987-6543",
        address: "123 Business St, Commerce City, CA",
        role: "DISTRIBUTOR",
      },
    })

    // Create demo loads
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dayAfterTomorrow = new Date(today)
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)

    // Pending loads
    await prisma.load.createMany({
      data: [
        {
          pickup: "Los Angeles, CA",
          delivery: "San Francisco, CA",
          distance: "382 miles",
          weight: "15,000 lbs",
          type: "Dry Van",
          rate: "$950",
          pickupDate: tomorrow,
          deliveryDate: dayAfterTomorrow,
          status: "PENDING",
          distributorId: distributor.id,
        },
        {
          pickup: "Seattle, WA",
          delivery: "Portland, OR",
          distance: "174 miles",
          weight: "22,000 lbs",
          type: "Refrigerated",
          rate: "$750",
          pickupDate: tomorrow,
          deliveryDate: tomorrow,
          status: "PENDING",
          distributorId: distributor.id,
        },
      ],
    })

    // Assigned load
    await prisma.load.create({
      data: {
        pickup: "Phoenix, AZ",
        delivery: "Las Vegas, NV",
        distance: "297 miles",
        weight: "17,500 lbs",
        type: "Dry Van",
        rate: "$720",
        pickupDate: today,
        deliveryDate: tomorrow,
        status: "IN_TRANSIT",
        distributorId: distributor.id,
        driverId: driver.id,
      },
    })

    // Completed loads
    const lastWeek = new Date(today)
    lastWeek.setDate(lastWeek.getDate() - 7)
    const twoWeeksAgo = new Date(today)
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

    await prisma.load.createMany({
      data: [
        {
          pickup: "Dallas, TX",
          delivery: "Houston, TX",
          distance: "239 miles",
          weight: "24,000 lbs",
          type: "Dry Van",
          rate: "$680",
          pickupDate: twoWeeksAgo,
          deliveryDate: twoWeeksAgo,
          status: "COMPLETED",
          distributorId: distributor.id,
          driverId: driver.id,
        },
        {
          pickup: "Miami, FL",
          delivery: "Orlando, FL",
          distance: "236 miles",
          weight: "18,000 lbs",
          type: "Refrigerated",
          rate: "$820",
          pickupDate: lastWeek,
          deliveryDate: lastWeek,
          status: "COMPLETED",
          distributorId: distributor.id,
          driverId: driver.id,
        },
      ],
    })

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      demoAccounts: {
        driver: { email: "driver@example.com", password: "password123" },
        distributor: { email: "distributor@example.com", password: "password123" },
      },
    })
  } catch (error) {
    console.error("Seed error:", error)
    return NextResponse.json({ success: false, error: "Failed to seed database" }, { status: 500 })
  }
}

