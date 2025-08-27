'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })

    if (res.ok) {
      const data = await res.json()
      localStorage.setItem('_id', data.user._id)
      localStorage.setItem('role', data.user.role)
      router.push('/blogs')
    } else {
      const data = await res.json()
      alert(data.error)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg bg-white/80 p-8 shadow-lg backdrop-blur-md"
      >
        <h1 className="mb-6 text-center text-3xl font-semibold text-gray-800">
          Login
        </h1>

        <div className="space-y-4">
          <input
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-800 focus:border-[#213555] focus:ring-1 focus:ring-[#213555] focus:outline-none"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-800 focus:border-[#213555] focus:ring-1 focus:ring-[#213555] focus:outline-none"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <button className="w-full cursor-pointer rounded-lg bg-[#213555] px-4 py-3 font-medium text-white shadow-md transition-all duration-200 hover:bg-[#1b2a44] focus:ring-1 focus:ring-[#213555] focus:outline-none">
            Login
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{' '}
          <a
            href="/signup"
            className="font-medium text-[#213555] hover:underline"
          >
            Sign up
          </a>
        </p>
      </form>
    </div>
  )
}
