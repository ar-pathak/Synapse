import { Outlet } from "react-router"
import NavBar from "./components/utils/NavBar"
import Footer from "./components/utils/Footer"
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster />
      <NavBar />
      <Outlet />
      <Footer />
    </>
  )
}

export default App
