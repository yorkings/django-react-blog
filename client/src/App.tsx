import { BrowserRouter as Router,Route,Routes } from "react-router-dom"
import Home from "./components/Home"
import Navbar from "./components/Navbar"
import Login from "./components/registration/Login"
import Signup from "./components/registration/Signup"
import Toast from "./plugin/Toast"
import NotFound from "./components/registration/NotFound"
function App() {


  return (
    <main className="h-screen">
      <Router>
         <Routes>
           <Route path="/" element={<Home/>}/>
           <Route path="*" element={<NotFound/>}/> 
           <Route path='/login' element={<Login/>}/>
           <Route path='/register' element={<Signup/>}/>
           <Route path='/login' element={<Login/>}/>
         </Routes>
      </Router>
      <Toast/>
    </main>
      
  )
}

export default App
