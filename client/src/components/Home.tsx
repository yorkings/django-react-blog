import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../lib/Api';
import { FaArrowRight, FaEye, FaUser } from 'react-icons/fa';
import { FaArrowLeft, FaCalendar } from 'react-icons/fa6';
import moment from 'moment';
import {  Pagination } from '@nextui-org/react';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState([]);
  const itemsperpage=4;
  const [currentPage,setCurrentpage]=useState(1)
  const  indexofLastItem=currentPage * itemsperpage
  const indexOfFirstItem=indexofLastItem -currentPage
  const postItems=posts?.slice(indexOfFirstItem,indexofLastItem)
  const totalpages=Math.ceil(posts.length /itemsperpage)
  const pagenumber=Array.from({length:totalpages},(_,index)=>index+1)
  const handlePostDetails = (slug) => {
    return slug;
  };

  const fetchPosts = async () => {
    try {
      const res_post = await api.get('post/list');
      const res_cat = await api.get('post/category/list/');
      setPosts(res_post.data);
      setCategory(res_cat.data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="p-6 bg-slate-50">
      {/* Category Section - Horizontal Scroll */}
      <div className="mb-8 bg-[#f5f5f5] border-none rounded-md">
        <div className="w-full flex justify-center my-4">
          <h1 className="text-3xl font-serif font-bold text-gray-800">Categories</h1>
        </div>
        <div className="flex gap-6 overflow-x-auto scrollbar-hide mb-3">
          {category.map((cat) => (
            <div
              className="min-w-[150px] bg-[#f1f1f1] rounded-md shadow-md overflow-hidden flex flex-col items-center transition-transform transform hover:scale-105 p-3 mb-5"
              key={cat.id}
            >
              <img
                src={cat.icons}
                alt={cat.title}
                className="w-12 h-12 mb-2 object-cover"
              />
              <h2 className="text-lg font-semibold text-gray-600">{cat.title}</h2>
              <p className='text-sm  font-light'>{cat.post_count || '0'}  <span>posts</span></p>
            </div>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="mb-4">
            <div className="w-full flex  justify-center mb-4">
                <h1 className="text-3xl font-serif font-bold text-gray-800">posts</h1>
              </div> 
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center ">
              {posts?.map((post) => (
                <div
                  className="bg-[#f5f5f5] shadow-lg rounded-md overflow-hidden transition-transform transform hover:scale-105"
                  key={post.id}
                  onClick={() => handlePostDetails(post.slug)}
                >
                  <div className="h-40 overflow-hidden">
                    <img src={post?.image} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 text-center">
                    <h1 className="text-lg font-semibold mb-2">{post.title}</h1>
                    <ul className="list-none flex items-center flex-col">
                      <li className="flex item-center gap-x-2 mt-2">
                        <FaUser />
                        <span>{post?.user.first_name} {post?.user.last_name}</span>
                      </li>
                      <li className="flex items-center gap-x-2 mt-2">
                        <FaCalendar />
                        <span>{moment(post.date).format('DD MMM, YYYY')}</span>
                      </li>
                      <li className="flex items-center gap-x-2 mt-2">
                        <FaEye />
                        <span>{post.view} views</span>
                      </li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
      </div>
       {/* pagination */}
      <div className="flex items-center justify-center">
       <ul>
        <li>
          <button disabled={` ${currentPage === 1 ? true:false}`}>
            <FaArrowLeft/> <span>previous</span> 
          </button>
        </li>
       </ul>
       <ul>
        <li>
          
        </li>
       </ul>
       <ul>
        <li>
          <button disabled="disabled">
            <span>next</span>
          </button>
        </li>
       </ul>
       </div>
    </div>
  );
};

export default Home;
