import { NextResponse } from "next/server"
import DatabaseService from "@/lib/database/database-service"
import bcrypt from "bcryptjs"

export async function POST(request) {
  try {
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      company, 
      role, 
      industry 
    } = await request.json()

    // Validate input
    if (!email || !password || !firstName || !lastName || !company || !role || !industry) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    // Combine first and last name
    const name = `${firstName} ${lastName}`

    // Check if user already exists
    const existingUser = await DatabaseService.getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await DatabaseService.createUser({
      email,
      password: hashedPassword,
      name,
      role,
      company,
      industry,
      firstName,
      lastName
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toObject()

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: "User created successfully"
    })

  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    )
  }
}
