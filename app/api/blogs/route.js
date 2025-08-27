import { NextResponse } from 'next/server'
import { connectDB } from '../../../mongodb'
import Blog from '../../../models/Blog'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

export async function GET() {
  await connectDB()
  const blogs = await Blog.find().sort({ createdAt: -1 })
  return NextResponse.json(blogs)
}

export async function POST(req) {
  await connectDB()

  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }
  let decoded
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
  const body = await req.json()
  const newBlog = await Blog.create({
    title: body.title,
    content: body.content,
    author: {
      id: decoded.id,
      name: decoded.email,
      role: decoded.role
    }
  })

  return NextResponse.json(newBlog, { status: 201 })
}
