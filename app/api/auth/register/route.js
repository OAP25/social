import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { hashPassword, generateToken } from "@/lib/auth"

export async function POST(request) {
  try {
    const { username, email, password } = await request.json()

    if (!username || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("social_media")
    const users = db.collection("users")

    // Check if user already exists
    const existingUser = await users.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password)
    const result = await users.insertOne({
      username,
      email,
      password: hashedPassword,
      bio: "",
      avatar: "",
      followers: [],
      following: [],
      createdAt: new Date(),
    })

    const token = generateToken(result.insertedId.toString())

    return NextResponse.json({
      message: "User created successfully",
      token,
      user: {
        id: result.insertedId,
        username,
        email,
        bio: "",
        avatar: "",
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
