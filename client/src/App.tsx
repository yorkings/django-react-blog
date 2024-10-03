import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/registration/Login";
import Signup from "./components/registration/Signup";
import Toast from "./plugin/Toast";
import NotFound from "./components/registration/NotFound";
import Detail from "./components/Detail";
import Logout from "./components/registration/Logout";
import { userStore } from "./lib/Userstore";
import { useEffect } from "react";
import { Authentic } from "./lib/auth";
import Category from "./components/category/Category";

function App() {
  
  const { fetchCurrentUser, currentUser } = userStore();
  
  useEffect(() => {
    const fetchUser = async () => {
      const user = await Authentic();
      fetchCurrentUser(user);
      console.log(user);
    };

    fetchUser(); // Call the fetchUser function when the component mounts
  }, [fetchCurrentUser]);

  console.log(currentUser?.username);

  return (
    <main className="h-screen">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />

          {/* Registration */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/logout" element={<Logout />} />

          {/* Posts */}
          <Route path="/category/:slug" element={<Category/>}/>
          <Route path="/post/:slug/" element={<Detail />} />
        </Routes>
      </Router>
      <Toast />
    </main>
  );
}

export default App;
