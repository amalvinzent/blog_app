'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CreateBlogPage() {
  const router = useRouter()
  const [form, setForm] = useState({ title: '', content: '' })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/blogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title,
        content: form.content
      })
    })
    setLoading(false)
    if (res.ok) {
      router.push('/blogs')
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
        <div className="w-12 h-12 border-4 border-[#213555] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl rounded-2xl bg-white/80 p-8 shadow-lg backdrop-blur-md"
      >
        <h1 className="mb-6 text-center text-3xl font-semibold text-gray-800">
          Create New Blog
        </h1>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-800 focus:border-[#213555] focus:ring-1 focus:ring-[#213555] focus:outline-none"
            required
          />
          <textarea
            placeholder="Content"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="w-full h-40 rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-800 focus:border-[#213555] focus:ring-1 focus:ring-[#213555] focus:outline-none"
            required
          />
          <button
            type="submit"
            className="cursor-pointer w-full rounded-lg bg-[#213555] px-4 py-3 font-medium text-white shadow-md transition-all duration-200 hover:bg-[#1b2a44] focus:ring-1 focus:ring-[#213555] focus:outline-none"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  )
}
