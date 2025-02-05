import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { connectToDatabase } from "@/lib/mongodb"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(req: Request) {
  const { email, password, isLogin } = await req.json()

  try {
    const { db } = await connectToDatabase()
    const collection = db.collection("users")

    if (isLogin) {
      const user = await collection.findOne({ email })
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
      }

      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" })
      return NextResponse.json({ token })
    } else {
      const existingUser = await collection.findOne({ email })
      if (existingUser) {
        return NextResponse.json({ error: "User already exists" }, { status: 400 })
      }

      const hashedPassword = bcrypt.hashSync(password, 10)
      const result = await collection.insertOne({ email, password: hashedPassword })
      const token = jwt.sign({ userId: result.insertedId }, JWT_SECRET, { expiresIn: "1h" })
      return NextResponse.json({ token })
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

