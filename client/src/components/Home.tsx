import React, { useEffect, useState } from 'react'
import { Authentic } from '../lib/auth'
import { userStore } from '../lib/Userstore'
import { Button } from '@nextui-org/react'

import { toast } from 'react-toastify'
import { api } from '../lib/Api'

const Home = () => {
  // const {customUser,isloading,setcustomUser}=userStore()
  const [posts,setPosts]=useState([])
  const [category,setCategory]=useState([])
  // useEffect(()=>{
  //   const fetchUser=async()=>{
  //     const user=await Authentic()

  //     setcustomUser(user)      
  //   }
  //   console.log(customUser); 
  //   return ()=>{
  //     fetchUser()
  //   }
  // },[setcustomUser])

  const fetchPosts=async()=>{
        try {
          const res_post= await api.get('post/list');
          const res_cat=await api.get('post/category/list/');
          setPosts(res_post.data)
          setCategory(res_cat.data)
        } catch (error) {
            toast.error(error) 
        }
       
  }
  useEffect(()=>{
    fetchPosts()
  },[])
  console.log(posts)

  // if(isloading)return <div className=" flex items-center justify-center ">
  //   <Button isLoading color="success"  spinner={
  //       <svg className="animate-spin h-5 w-5 text-current" fill="none"  viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" >
  //         <circle className="opacity-25"  cx="12"     cy="12"    r="10"       stroke="currentColor"   strokeWidth="4"/>
  //         <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"/>
  //       </svg>
  //   }
  //       >
  //         loading ...
  //   </Button>
  // </div>
  return (
      <div className="">
         <div className="">
            {posts?.map((post)=>(
               <div className="h-[30vh] md:h-[40vh]" key={post?.id}>
                     <div className="">
                      <img src={post.image} alt={post.title} />
                     </div>
                     <h4>{post.title}</h4>
                     <p>{post.content}</p>

               </div>
            ))}
         </div>
      </div>          
  )
}

export default Home
