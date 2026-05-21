import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Submit from './pages/Submit'
import Board from './pages/Board'
import ProblemDetail from './pages/ProblemDetail'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/submit" element={<Submit />} />
        <Route path="/board" element={<Board />} />
        <Route path="/problem/:id" element={<ProblemDetail />} />
      </Routes>
    </BrowserRouter>
  )
}
