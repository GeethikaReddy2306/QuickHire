import { Routes,Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./Pages/HomePage";
import JobsPage from "./Pages/JobsPage";
import BrowsePage from "./Pages/BrowsePage";
import Footer from "./components/Footer";
export default function App() {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path ="/" element={<HomePage/>}/>
        <Route path ="/jobs" element={<JobsPage/>}/>
        <Route path ="/browse" element={<BrowsePage/>}/>
        
      </Routes>
      <Footer/>
    </div>
  )
}
