import { Outlet } from 'react-router-dom'
import Header from './Header'
import BottomNav from './BottomNav'

export default function Layout() {
  return (
    <div className="min-h-screen bg-surface text-on-surface antialiased">
      <Header />
      <main className="max-w-7xl mx-auto pb-24 lg:pb-12">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}