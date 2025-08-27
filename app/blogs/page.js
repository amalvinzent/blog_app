'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function BlogsPage() {
  const router = useRouter()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [user, setUser] = useState({ id: '', role: '' })
  const [showDialog, setShowDialog] = useState(false)

  useEffect(() => {
    async function fetchBlogs() {
      const res = await fetch('/api/blogs')
      if (res.ok) {
        const data = await res.json()
        setBlogs(data)
      }
      setLoading(false)
    }
    fetchBlogs()
    const id = localStorage.getItem('_id')
    const role = localStorage.getItem('role')
    setUser({ id, role })
  }, [])

  async function handleDeleteConfirm() {
    if (!deleteId) return
    const res = await fetch(`/api/blogs/${deleteId}`, { method: 'DELETE' })
    if (res.ok) {
      setBlogs(blogs.filter((b) => b._id !== deleteId))
      setDeleteId(null)
      setShowDialog(false)
    } else {
      setShowDialog(false)
      alert('Error')
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    localStorage.removeItem('_id')
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
        <div className="w-12 h-12 border-4 border-[#213555] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-6">
      <main className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Blogs</h1>
          <div className="flex gap-2">
            <button
              onClick={() => router.push('/blogs/create')}
              className="cursor-pointer px-4 py-2 rounded-lg bg-[#213555] text-white font-medium shadow-md transition-all duration-200 hover:bg-[#1b2a44] focus:ring-1 focus:ring-[#213555] focus:outline-none"
            >
              + New Blog
            </button>
            <button
              onClick={handleLogout}
              className="cursor-pointer px-4 py-2 rounded-lg bg-[#213555] text-white font-medium shadow-md transition-all duration-200 hover:bg-gray-700 focus:ring-1 focus:ring-gray-600 focus:outline-none"
            >
              Logout
            </button>
          </div>
        </div>

        {blogs.length === 0 ? (
          <p className="text-gray-600 text-center">No blogs yet. Create one!</p>
        ) : (
          <div className="space-y-6">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-md"
              >
                <h2 className="text-2xl font-semibold text-gray-800">
                  {blog.title}
                </h2>
                <p className="mt-3 text-gray-700 line-clamp-3">
                  {blog.content}
                </p>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
                  <a
                    href={`/users/${blog.author.id}`}
                    className="font-medium text-[#213555] hover:underline"
                  >
                    {blog.author.name}
                  </a>
                  <span>
                    Created: {new Date(blog.createdAt).toLocaleDateString()}
                  </span>
                  {blog.updatedAt && (
                    <span>
                      Updated: {new Date(blog.updatedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                {(user.role === 'admin' ||
                  (user.role === 'user' && user.id === blog.author.id)) && (
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => router.push(`/blogs/edit/${blog._id}`)}
                      className="cursor-pointer px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium shadow-md transition-all duration-200 hover:bg-emerald-700 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => {
                        setDeleteId(blog._id)
                        setShowDialog(true)
                      }}
                      className="cursor-pointer px-4 py-2 rounded-lg bg-red-600 text-white font-medium shadow-md transition-all duration-200 hover:bg-red-700 focus:ring-1 focus:ring-red-600 focus:outline-none"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Confirm Delete
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this blog? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDialog(false)}
                className="px-4 py-2 rounded-lg bg-gray-300 text-gray-800 font-medium hover:bg-gray-400 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
