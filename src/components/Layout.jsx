import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';
import AchievementToast from './AchievementToast';
import ReminderCenter from './ReminderCenter';
import { useUser } from '../data/db';

export default function Layout() {
  const user = useUser();
  const { pathname } = useLocation();
  if (!user) return <Navigate to="/login" replace />; // not logged in -> login page
  return (
    <div className="min-h-screen text-[#0b1c30]">
      <Header />
      <main key={pathname.split('/')[1]} className="page-enter">
        <Outlet />
      </main>
      <BottomNav />
      <AchievementToast />
      <ReminderCenter />
    </div>
  );
}
