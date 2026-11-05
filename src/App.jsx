import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import CharacterDetail from './pages/CharacterDetail'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="character/:id" element={<CharacterDetail />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
