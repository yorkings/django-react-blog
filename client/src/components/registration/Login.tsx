
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../lib/constants"
import { toast } from "react-toastify"
import { api } from "../../lib/Api"



const Login = () => {
  const [loading,setloading]=useState(false)
  const navigate=useNavigate()
  const handleLogin=async(e)=>{
    setloading(true)
    e.preventDefault()
    const data=new FormData(e.target)
    const {username,password}=Object.fromEntries(data)

    try {
       const res = await api.post('user/token/',{username,password})
       localStorage.setItem(ACCESS_TOKEN,res.data.access)
       localStorage.setItem(REFRESH_TOKEN,res.data.refresh)
       navigate("/");
       toast.success("Sign in successfully!");
    } catch (error) {
        toast.error("invalid credentials ")
        console.log(error)
    }
    finally{
      setloading(false)
    }
  }
  return (
    <div className="h-screen bg-[url('/bg.webp')] bg-cover bg-center flex items-center justify-center">
  <div className="flex flex-col items-center justify-center text-cyan-500 bg-[rgba(17,25,40,0.75)] backdrop-blur-lg backdrop-saturate-[180%] min-h-[40vh] min-w-[30vw] md:min-w-[20vw] lg:min-w-[30vw] p-8 rounded-lg shadow-xl gap-6 transition-transform duration-300 ease-in-out hover:translate-y-2">
    <div className="w-full"> 
      <h1 className='mb-0 text-2xl font-serif uppercase text-center '>login</h1>
      <div className="h-[0.125rem] w-[50%] bg-black mx-auto transition-all duration-500 ease-in-out hover:w-full mt-0"></div>
    </div>    
    <form className="flex flex-col gap-6 w-full" onSubmit={handleLogin}>
      <input
        type="text"
        name="username"
        placeholder="Username"
        className="w-full px-4 py-2 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors duration-300"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        className="w-full px-4 py-2 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors duration-300"
      />
      
      <div className="flex justify-center">
        <button
          className="w-[70%] p-3 text-white bg-sky-600 rounded-lg cursor-pointer transition-all duration-300 transform hover:bg-sky-700 hover:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
      </div>
    </form>
    
    <p className="mt-4 text-lg text-center text-gray-400">
      Don't have an account? 
      <Link to='/register' className="text-cyan-500 ml-1 hover:text-orange-600 transition-colors duration-300 text-xl">Sign Up</Link>
    </p>
  </div>
</div>

  )
}

export default Login