import React, { useCallback, useEffect, useState } from 'react'
import { apiAuth } from '../../lib/Api'
import { useNavigate, useParams } from 'react-router-dom'
import { FaArrowLeft, FaCalendar, FaEye, FaUser ,FaArrowRight} from 'react-icons/fa'
import moment from 'moment'

const Category = () => {
  const [cats,setCat]=useState([])
  const [post,setPosts]=useState([])
  const {slug}=useParams()
  const navigate=useNavigate()
//   pagination
  const [currentPage,setCurrentPage]=useState(1)
  const itemsPerPage= 4
  const indexOfLastItem= itemsPerPage *currentPage
  const indexOfFirstItem=indexOfLastItem - itemsPerPage
  const PostItems=post?.slice(indexOfFirstItem,indexOfLastItem)
  const totalPages = Math.ceil(post.length / itemsPerPage);

  const fetchCategories=useCallback(async()=>{
    const res_cat = await apiAuth.get('post/category/list/')
    const res_pos = await apiAuth.get(`post/category/post/${slug}`)
    setCat(res_cat.data)
    setPosts(res_pos.data)
    } ,[slug]) 
    const handleCategory=(slug)=>{
        navigate(`category/${slug}`)
    }
    const handlePostDetails = (slug) => {
        navigate(`/post/${slug}`)
    };
  useEffect(()=>{
    fetchCategories();
  },[fetchCategories])


  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
       <div className="mb-8 bg-[#f5f5f5] border-none rounded-md">
        <div className="w-full flex justify-center my-4">
          <h1 className="text-3xl font-serif font-bold text-gray-800">Categories</h1>
        </div>
        <div className="flex gap-6 overflow-x-auto scrollbar-hide mb-3">
          {cats?.map((cat) => (
            <div
              className="min-w-[150px] bg-[#f1f1f1] rounded-md shadow-md overflow-hidden flex flex-col items-center transition-transform transform hover:scale-105 p-3 mb-5"
              key={cat.id} onClick={()=>handleCategory(cat.slug)}
            >
              <img
                src={cat.icons}
                alt={cat.title}
                className="w-12 h-12 mb-2 object-cover"
              />
              <h2 className="text-lg font-semibold text-gray-600">{cat.title}</h2>
              <p className="text-sm font-light">{cat.post_count || '0'} <span>posts</span></p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <div className="w-full flex justify-center mb-4">
          <h1 className="text-3xl font-serif font-bold text-gray-800">Posts</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 items-center">
          {PostItems?.map((post) => (
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
                  <li className="flex items-center gap-x-2 mt-2">
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

     {/* Pagination */}
     <div className="flex items-center justify-center">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-3 py-1 mx-1 bg-gray-300 rounded flex items-center  ${currentPage === 1 && 'opacity-50 cursor-not-allowed'}`}
        >
          <FaArrowLeft />  <span>Prev</span>
        </button>

        {Array.from({ length: totalPages }, (_, index) =>(
          <button
            key={index + 1}
            onClick={() => handlePageClick(index + 1)}
            className={`px-3 py-1 mx-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 mx-1 bg-gray-300 rounded-md  flex items-center ${currentPage === totalPages && 'opacity-50 cursor-not-allowed'} `}
        >
        <span>Next</span> <FaArrowRight/>
        </button>
      </div>

    </div>
  )
}

export default Category
