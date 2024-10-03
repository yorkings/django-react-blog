import { useCallback, useEffect, useState } from "react";
import { apiAuth } from "../lib/Api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ACCESS_TOKEN } from "../lib/constants";
import { toast } from "react-toastify";
import moment from "moment";
import { FaEye, FaHeart, FaUserAlt } from "react-icons/fa";

const Detail = () => {
  const [post, setPost] = useState(null); // Holds post data
  const [tags, setTags] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const { slug } = useParams();
  const location = useLocation();

  // Check if the screen size is mobile or desktop
  const checkScreenSize = () => {
    const width = window.innerWidth;
    setIsMobile(width < 600);
  };

  useEffect(() => {
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const fetchPost = useCallback(async () => {
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) {
        navigate("/login", { state: { whereTo: location } });
        return;
      }

      const res = await apiAuth.get(`post/detail/${slug}`);
      setPost(res.data);

      const ArrayTags = res.data?.tags?.split(",") || [];
      setTags(ArrayTags);
    } catch (error) {
      toast.error(error.message || "Failed to fetch post details");
    }
  }, [slug, navigate, location]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  if (!post) return <p>Loading...</p>; // Show a loading state if post is not yet loaded

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Author Section */}
        <div className="flex items-center flex-col md:w-1/3">
          <img
            src={post?.profile?.image}
            alt={post?.user?.username}
            className="h-40 w-40 object-cover rounded-full shadow-lg mb-4"
          />
          <h3 className="flex items-center text-xl font-medium mb-2 gap-2 text-gray-800">
            <FaUserAlt />
            <span>
              {post?.user?.first_name} {post?.user?.last_name || post?.user?.username}
            </span>
          </h3>
          <p className="text-gray-600">
            {moment(post?.created_at).format("MMMM Do YYYY")}
          </p>
          <div className="mt-4 flex gap-4 text-gray-600">
            <p className="flex items-center gap-1">
              <FaEye /> {post?.view} Views
            </p>
            <p className="flex items-center gap-1">
              <FaHeart color="red" /> {post?.like?.length || 0} Likes
            </p>
          </div>
        </div>

        {/* Post Content Section */}
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{post?.title}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-200 text-sm rounded-full text-gray-700"
              >
                #{tag.trim()}
              </span>
            ))}
          </div>
          <div className="text-gray-800 leading-relaxed">
            <p>{post?.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
