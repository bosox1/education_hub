import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Hub from './pages/Hub'
import Section from './pages/Section'
import Material from './pages/Material'
import Podcasts from './pages/Podcasts'
import About from './pages/About'
import Authors from './pages/Authors'
import Nmt from './pages/Nmt'
import Vacancies from './pages/Vacancies'
import Tccc from './pages/Tccc'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="hub" element={<Hub />} />
        <Route path="hub/dentistry/podcasts" element={<Podcasts />} />
        <Route path="hub/:section" element={<Section />} />
        <Route path="material/:id" element={<Material />} />
        <Route path="about" element={<About />} />
        <Route path="authors" element={<Authors />} />
        <Route path="nmt" element={<Nmt />} />
        <Route path="vacancies" element={<Vacancies />} />
        <Route path="tccc" element={<Tccc />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
