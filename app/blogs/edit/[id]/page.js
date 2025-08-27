'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState, use } from 'react'

export default function UpdateBlogPage({ params: paramsPromise }) {
  const router = useRouter()
  const params = use(paramsPromise)
  const { id } = params

  const [form, setForm] = useState({ title: '', content: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBlog() {
      const res = await fetch(`/api/blogs/${id}`)
      if (res.ok) {
        const data = await res.json()
        setForm({ title: data.title, content: data.content })
      }
      setLoading(false)
    }
    fetchBlog()
  }, [id])

  async function handleSubmit(e) {
    e.preventDefault()
    const res = await fetch(`/api/blogs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    if (res.ok) {
      router.push('/blogs')
    } else {
      alert('Error')
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
          Update Blog
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
          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="cursor-pointer px-4 py-3 rounded-lg bg-[#213555] text-white font-medium shadow-md transition-all duration-200 hover:bg-[#1b2a44] focus:ring-1 focus:ring-[#213555] focus:outline-none"
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => router.push('/blogs')}
              className="cursor-pointer px-4 py-3 rounded-lg bg-[#213555] text-white font-medium shadow-md transition-all duration-200 hover:bg-gray-600 focus:ring-1 focus:ring-gray-500 focus:outline-none"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
