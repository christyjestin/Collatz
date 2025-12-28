import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import Collatz from './Collatz'
import Info from './Info'
import './App.css'

function CollatzWrapper() {
  const { num } = useParams()
  return <Collatz input={num} />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Collatz />} />
        <Route path="/:num" element={<CollatzWrapper />} />
        <Route path="/info" element={<Info />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
