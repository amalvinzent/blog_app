'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  })
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })

    if (res.ok) {
      router.push('/login')
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
          Create Account
        </h1>

        <div className="space-y-4">
          <input
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-800 focus:border-[#213555] focus:ring-1 focus:ring-[#213555] focus:outline-none"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
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
          <select
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-800 focus:border-[#213555] focus:ring-1 focus:ring-[#213555] focus:outline-none cursor-pointer"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button className="w-full cursor-pointer rounded-lg bg-[#213555] px-4 py-3 font-medium text-white shadow-md transition-all duration-200 hover:bg-[#1b2a44] focus:ring-1 focus:ring-[#213555] focus:outline-none">
            Sign Up
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a
            href="/login"
            className="font-medium text-[#213555] hover:underline"
          >
            Log in
          </a>
        </p>
      </form>
    </div>
  )
}
