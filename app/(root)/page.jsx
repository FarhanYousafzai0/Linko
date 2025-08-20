"use client"

import { useEffect, useState } from "react"

const Page = () => {
  const [users, setUsers] = useState([])
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [editUser, setEditUser] = useState(null)


  const getUsers = async () => {
    const res = await fetch("/api/users")
    const data = await res.json()
    setUsers(data)
  }

  useEffect(() => {
    getUsers()
  }, [])

 
  const postUser = async (e) => {
    e.preventDefault()
    if (!name || !email) return
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // fixed typo
      body: JSON.stringify({ name, email }),
    })

    if (res.ok) {
      setName("")
      setEmail("")
      getUsers()
    }
  }


  const deleteUser = async (id) => {
    await fetch(`/api/users/${id}`, { method: "DELETE" }) 
    getUsers()
  }


  const updateUser = async (e) => {
    e.preventDefault()
    const res = await fetch(`/api/users/${editUser?._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    })

    if (res.ok) {
      setEditUser(null)
      setName("")
      setEmail("")
      getUsers()
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-10 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">👤 User Management</h1>

      <form
        onSubmit={editUser ? updateUser : postUser}
        className="flex gap-4 mb-6"
      >
        <input
          className="p-2 border rounded"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="p-2 border rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          {editUser ? "Update" : "Add"}
        </button>
      </form>

      <ul className="w-full max-w-lg space-y-2">
        {users.map((user) => (
          <li
            key={user._id}
            className="flex justify-between items-center p-3 bg-white shadow rounded"
          >
            <span>
              {user.name} — {user.email}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditUser(user)
                  setName(user.name)
                  setEmail(user.email)
                }}
                className="bg-yellow-400 px-2 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => deleteUser(user._id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Page
