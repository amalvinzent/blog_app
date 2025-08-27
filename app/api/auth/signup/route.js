import { NextResponse } from 'next/server'
import { connectDB } from '../../../../mongodb'
import User from '../../../../models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(req) {
  try {
    const { name, email, password, role } = await req.json()
    await connectDB()
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    })
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )
    const res = NextResponse.json({ message: 'Signup successful', user })
    res.cookies.set('token', token, { httpOnly: true, maxAge: 60 * 60 * 24 })
    return res
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
