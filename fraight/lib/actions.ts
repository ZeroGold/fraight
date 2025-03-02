"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { hash, compare } from "bcrypt"

// User authentication actions
export async function registerUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const role = formData.get("role") as string

  // Additional fields based on role
  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const phone = formData.get("phone") as string
  const companyName = formData.get("companyName") as string
  const address = formData.get("address") as string

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: "User already exists" }
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role === "driver" ? "DRIVER" : "DISTRIBUTOR",
        firstName: role === "driver" ? firstName : null,
        lastName: role === "driver" ? lastName : null,
        phone,
        companyName: role === "distributor" ? companyName : null,
        address: role === "distributor" ? address : null,
      },
    })

    revalidatePath("/login")
    redirect(`/dashboard/${role}`)
  } catch (error) {
    console.error("Registration error:", error)
    return { error: "Failed to register user" }
  }
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const role = formData.get("role") as string

  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return { error: "User not found" }
    }

    // Check if role matches
    if ((role === "driver" && user.role !== "DRIVER") || (role === "distributor" && user.role !== "DISTRIBUTOR")) {
      return { error: "Invalid role for this account" }
    }

    // Verify password
    const passwordMatch = await compare(password, user.password)
    if (!passwordMatch) {
      return { error: "Invalid password" }
    }

    // Redirect to dashboard
    revalidatePath(`/dashboard/${role}`)
    redirect(`/dashboard/${role}`)
  } catch (error) {
    console.error("Login error:", error)
    return { error: "Failed to login" }
  }
}

// Load management actions
export async function getDriverLoads(driverId: string) {
  try {
    return await prisma.load.findMany({
      where: {
        driverId,
        status: {
          in: ["ASSIGNED", "IN_TRANSIT"],
        },
      },
      orderBy: {
        pickupDate: "asc",
      },
    })
  } catch (error) {
    console.error("Error fetching driver loads:", error)
    return []
  }
}

export async function getAvailableLoads() {
  try {
    return await prisma.load.findMany({
      where: {
        status: "PENDING",
        driverId: null,
      },
      orderBy: {
        pickupDate: "asc",
      },
    })
  } catch (error) {
    console.error("Error fetching available loads:", error)
    return []
  }
}

export async function acceptLoad(loadId: string, driverId: string) {
  try {
    const updatedLoad = await prisma.load.update({
      where: { id: loadId },
      data: {
        driverId,
        status: "ASSIGNED",
      },
    })

    revalidatePath("/dashboard/driver")
    return updatedLoad
  } catch (error) {
    console.error("Error accepting load:", error)
    return { error: "Failed to accept load" }
  }
}

export async function markLoadAsDelivered(loadId: string) {
  try {
    const updatedLoad = await prisma.load.update({
      where: { id: loadId },
      data: {
        status: "COMPLETED",
      },
    })

    revalidatePath("/dashboard/driver")
    return updatedLoad
  } catch (error) {
    console.error("Error marking load as delivered:", error)
    return { error: "Failed to mark load as delivered" }
  }
}

export async function getDistributorLoads(distributorId: string) {
  try {
    return await prisma.load.findMany({
      where: {
        distributorId,
        status: {
          in: ["PENDING", "ASSIGNED", "IN_TRANSIT"],
        },
      },
      include: {
        driver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        pickupDate: "asc",
      },
    })
  } catch (error) {
    console.error("Error fetching distributor loads:", error)
    return []
  }
}

export async function getCompletedLoads(distributorId: string) {
  try {
    return await prisma.load.findMany({
      where: {
        distributorId,
        status: "COMPLETED",
      },
      include: {
        driver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        deliveryDate: "desc",
      },
    })
  } catch (error) {
    console.error("Error fetching completed loads:", error)
    return []
  }
}

export async function createLoad(formData: FormData, distributorId: string) {
  const pickup = formData.get("pickup") as string
  const delivery = formData.get("delivery") as string
  const weight = formData.get("weight") as string
  const type = formData.get("type") as string
  const rate = formData.get("rate") as string
  const distance = formData.get("distance") as string
  const pickupDate = new Date(formData.get("pickupDate") as string)
  const deliveryDate = new Date(formData.get("deliveryDate") as string)

  try {
    const newLoad = await prisma.load.create({
      data: {
        pickup,
        delivery,
        weight: `${weight} lbs`,
        type,
        rate: `$${rate}`,
        distance: `${distance} miles`,
        pickupDate,
        deliveryDate,
        status: "PENDING",
        distributorId,
      },
    })

    revalidatePath("/dashboard/distributor")
    return newLoad
  } catch (error) {
    console.error("Error creating load:", error)
    return { error: "Failed to create load" }
  }
}

// Stats actions
export async function getDriverStats(driverId: string) {
  try {
    // Get completed loads for earnings calculation
    const completedLoads = await prisma.load.findMany({
      where: {
        driverId,
        status: "COMPLETED",
      },
    })

    // Calculate weekly earnings (loads completed in the last 7 days)
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const weeklyLoads = completedLoads.filter((load) => new Date(load.deliveryDate) >= oneWeekAgo)

    const weeklyEarnings = weeklyLoads.reduce((total, load) => {
      const rateValue = Number.parseInt(load.rate.replace(/\D/g, ""))
      return total + rateValue
    }, 0)

    // Calculate total miles
    const totalMiles = completedLoads.reduce((total, load) => {
      const distanceValue = Number.parseInt(load.distance.replace(/\D/g, ""))
      return total + distanceValue
    }, 0)

    // Get counts of available and active loads
    const availableLoadsCount = await prisma.load.count({
      where: {
        status: "PENDING",
        driverId: null,
      },
    })

    const activeLoadsCount = await prisma.load.count({
      where: {
        driverId,
        status: {
          in: ["ASSIGNED", "IN_TRANSIT"],
        },
      },
    })

    return {
      weeklyEarnings,
      totalMiles,
      availableLoadsCount,
      activeLoadsCount,
    }
  } catch (error) {
    console.error("Error fetching driver stats:", error)
    return {
      weeklyEarnings: 0,
      totalMiles: 0,
      availableLoadsCount: 0,
      activeLoadsCount: 0,
    }
  }
}

export async function getDistributorStats(distributorId: string) {
  try {
    // Get active loads count
    const activeLoadsCount = await prisma.load.count({
      where: {
        distributorId,
        status: {
          in: ["PENDING", "ASSIGNED", "IN_TRANSIT"],
        },
      },
    })

    // Get assigned loads count
    const assignedLoadsCount = await prisma.load.count({
      where: {
        distributorId,
        status: {
          in: ["ASSIGNED", "IN_TRANSIT"],
        },
      },
    })

    // Get completed loads count
    const completedLoadsCount = await prisma.load.count({
      where: {
        distributorId,
        status: "COMPLETED",
      },
    })

    // Calculate monthly spend
    const firstDayOfMonth = new Date()
    firstDayOfMonth.setDate(1)
    firstDayOfMonth.setHours(0, 0, 0, 0)

    const completedLoadsThisMonth = await prisma.load.findMany({
      where: {
        distributorId,
        status: "COMPLETED",
        deliveryDate: {
          gte: firstDayOfMonth,
        },
      },
    })

    const monthlySpend = completedLoadsThisMonth.reduce((total, load) => {
      const rateValue = Number.parseInt(load.rate.replace(/\D/g, ""))
      return total + rateValue
    }, 0)

    return {
      activeLoads: activeLoadsCount,
      assignedLoads: assignedLoadsCount,
      completedLoads: completedLoadsCount,
      monthlySpend,
    }
  } catch (error) {
    console.error("Error fetching distributor stats:", error)
    return {
      activeLoads: 0,
      assignedLoads: 0,
      completedLoads: 0,
      monthlySpend: 0,
    }
  }
}

