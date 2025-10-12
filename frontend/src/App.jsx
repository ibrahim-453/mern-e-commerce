import { BrowserRouter, Route, Routes } from "react-router-dom"
import Layout from "./layout/Layout"
import Header from "./components/Header"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout/>}>
          <Route index element={<h2>Home</h2>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App