import { NextResponse } from 'next/server'
import { connectDB } from '../../../../mongodb'
import Blog from '../../../../models/Blog'

export async function GET(req, { params }) {
  await connectDB()
  try {
    const blog = await Blog.findById(params.id)
    if (!blog) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json(blog)
  } catch (error) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }
}

export async function PUT(req, { params }) {
  const userHeader = req.headers.get('x-user')
  const user = userHeader ? JSON.parse(decodeURIComponent(userHeader)) : null
  const { id } = await params
  await connectDB()
  const blog = await Blog.findById(id)
  if (!blog) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (user.role !== 'admin' && user.id !== blog.author.id) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
  }
  const body = await req.json()
  await Blog.findByIdAndUpdate(
    id,
    { title: body.title, content: body.content },
    { new: true }
  )
  return NextResponse.json(blog)
}

export async function DELETE(req, { params }) {
  const userHeader = req.headers.get('x-user')
  const user = userHeader ? JSON.parse(decodeURIComponent(userHeader)) : null
  const { id } = await params
  await connectDB()
  const blog = await Blog.findById(id)
  if (!blog) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (user.role !== 'admin' && user.id !== blog.author.id) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
  }
  await Blog.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}
