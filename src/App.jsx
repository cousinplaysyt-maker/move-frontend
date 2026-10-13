import { BrowserRouter, Routes, Route, useInRouterContext } from 'react-router-dom';
import Layout from './components/Layout';
import Discover from './pages/Discover';
import MapView from './pages/MapView';
import NearMe from './pages/NearMe';
import OpenPlay from './pages/OpenPlay';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import BookCourt from './pages/BookCourt';
import HostPlay from './pages/HostPlay';
import FindPlayers from './pages/FindPlayers';
import Tourneys from './pages/Tourneys';
import VenueDetails from './pages/VenueDetails';
import NotFound from './pages/NotFound';
import { initDb } from './data/db';

initDb(); // creates the local database on first run

export default function App() {
  const alreadyInRouter = useInRouterContext(); // true if main.jsx already wraps <BrowserRouter>

  const routes = (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Discover />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/near-me" element={<NearMe />} />
        <Route path="/open-play" element={<OpenPlay />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/book" element={<BookCourt />} />
        <Route path="/book/:venueId" element={<BookCourt />} />
        <Route path="/host" element={<HostPlay />} />
        <Route path="/players" element={<FindPlayers />} />
        <Route path="/tourneys" element={<Tourneys />} />
        <Route path="/venue/:id" element={<VenueDetails />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );

  return alreadyInRouter ? routes : <BrowserRouter>{routes}</BrowserRouter>;
}
