import { Navigate, Outlet } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';
import AchievementToast from './AchievementToast';
import { useUser } from '../data/db';

export default function Layout() {
  const user = useUser();
  if (!user) return <Navigate to="/login" replace />; // not logged in -> login page
  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30]">
      <Header />
      <main>
        <Outlet />
      </main>
      <BottomNav />
      <AchievementToast />
    </div>
  );
}
