import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Discover from './pages/Discover'

const Placeholder = ({ title }) => (
  <div className="px-4 md:px-8 py-10">
    <h1 className="text-headline-lg text-on-surface">{title}</h1>
    <p className="text-body-md text-secondary mt-2">Coming soon.</p>
  </div>
)

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Discover />} />
        <Route path="/map-view" element={<Placeholder title="Map View" />} />
        <Route path="/near-me" element={<Placeholder title="Near Me" />} />
        <Route path="/open-play" element={<Placeholder title="Open Play" />} />
        <Route path="/profile" element={<Placeholder title="Profile" />} />
      </Route>
    </Routes>
  )
}