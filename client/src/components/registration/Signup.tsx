import { useState } from 'react'
import { Link, useNavigate} from 'react-router-dom'
import { toast } from 'react-toastify'
import { api } from '../../lib/Api'


const Signup = () => {
  const [loading,setloading]=useState(false)
  const navigate=useNavigate()
  const handleSignup=async(e)=>{
    setloading(true)
    e.preventDefault()
    localStorage.clear()
    const formdata=new FormData(e.target)
    const {username,first_name,last_name,email,password1,password2}=Object.fromEntries(formdata)
    try {
       if(password1 === password2){
        const res= await api.post("user/register/",{username,first_name,last_name,email,password1,password2})
        console.log('Response:', res);
        toast.success("Successfully created an account");
        navigate("/login");
       }
        else{
          toast.error("passwords do not match")
        }
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 
        error.response?.data?.message || 
        Object.values(error.response?.data || {}).join(' ') || 
        "An error occurred. Please try again.";
        
      toast.error(errorMessage);
    }
    
    finally{
      setloading(false)
    }
  }
  return (
    <div className='bg-[url(/bg.webp)] h-full bg-cover bg-left text-white'>
  <div className="flex items-center justify-center min-h-[70vh]">
    <div className="flex flex-col items-center justify-center text-cyan-500 bg-[rgba(17,25,40,0.75)] backdrop-blur-lg backdrop-saturate-[180%] min-h-[40vh] min-w-[30vw] md:min-w-[20vw] lg:min-w-[30vw] p-8 rounded-lg shadow-lg gap-6 transition-transform duration-300 ease-in-out hover:translate-y-2">
      
      <div className="w-full">
        <h1 className='mb-0 text-3xl font-serif uppercase text-center'>Register</h1>
        <div className="h-[0.125rem] w-[50%] bg-black mx-auto transition-all duration-500 ease-in-out hover:w-full"></div>
      </div>

      <form className='flex flex-col gap-6 w-full' onSubmit={handleSignup}>
        <input type="text" name='first_name' placeholder='First Name' className="w-full px-4 py-2 text-white bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-center transition-colors duration-300" />
        <input type="text" name='last_name' placeholder='Last Name' className="w-full px-4 py-2 text-white bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-center transition-colors duration-300" />
        <input type="text" name='username' placeholder='Username' className="w-full px-4 py-2 text-white bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-center transition-colors duration-300" />
        <input type="email" name='email' placeholder='abc@gmail.com' className="w-full text-center px-4 py-2 text-white bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors duration-300" />
        <input type="password" name='password1' placeholder='Password' className="w-full px-4 py-2 text-white text-center bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors duration-300" />
        <input type="password" name='password2' placeholder='Confirm Password' className="w-full px-4 py-2 text-white text-center bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors duration-300" />

        <div className="flex justify-center">
          <button className="mx-4 w-[70%] p-3 text-white text-center bg-sky-600 rounded-lg cursor-pointer transition-all duration-300 transform hover:bg-sky-700 hover:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>
            Sign Up
          </button>
        </div>
      </form>

      <p className="mt-6 text-lg text-center text-gray-400">
        Already have an account? 
        <Link to='/login' className='text-cyan-500 text-xl hover:text-orange-700 transition-colors duration-300'> Sign In</Link>
      </p>
    </div>
  </div>
</div>

  )
}

export default Signup

