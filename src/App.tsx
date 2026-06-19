import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Home } from './pages/Home'
import { Fundamentals } from './pages/Fundamentals'
import { BuildingBlocks } from './pages/BuildingBlocks'
import { Patterns } from './pages/Patterns'
import { CaseStudies } from './pages/CaseStudies'
import { Estimate } from './pages/Estimate'
import { Canvas } from './pages/Canvas'
import { Interview } from './pages/Interview'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fundamentals" element={<Fundamentals />} />
          <Route path="/blocks" element={<BuildingBlocks />} />
          <Route path="/patterns" element={<Patterns />} />
          <Route path="/cases" element={<CaseStudies />} />
          <Route path="/estimate" element={<Estimate />} />
          <Route path="/canvas" element={<Canvas />} />
          <Route path="/interview" element={<Interview />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
