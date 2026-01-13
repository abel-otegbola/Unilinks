import { Route, Routes } from "react-router-dom"
import Login from "./login"
import Register from "./register";

function AuthLayout() {

  return (
    <div className="text-[14px] sm:text-[15px] lg:text-[15px] 2xl:text-[16px] tracking-[5%]">
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    </div>
  )
}

export default AuthLayout;
