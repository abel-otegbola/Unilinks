import { Route, Routes } from "react-router-dom"
import Login from "./login"
import Register from "./register";
import AuthOverlay from "../../components/authOverlay/authOverlay";

function AuthLayout() {

  return (
    <div className="flex text-[14px] sm:text-[15px] lg:text-[15px] 2xl:text-[16px] tracking-[5%]">
        <AuthOverlay />
        <div className="w-full 2xl:w-[65%] xl:w-[70%] md:w-[65%] h-screen flex items-center justify-center">
          <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
          </Routes>
        </div>
    </div>
  )
}

export default AuthLayout;
