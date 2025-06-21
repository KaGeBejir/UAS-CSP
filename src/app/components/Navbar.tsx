import { useRouter } from 'next/navigation'
import { clearSession } from '../utils/auth'

export default function Navbar({ username }: { username: string }) {
  const router = useRouter()
  const logout = () => {
    clearSession()
    router.push('/signin')
  }

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <span>Welcome, {username}</span>
      <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
    </nav>
  )
}
