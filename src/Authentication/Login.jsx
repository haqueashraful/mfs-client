import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import useAuth from "../Hooks/useAuth";
import SocialLogin from "../Components/SocialLogin";
import img from '../assets/login.svg'

const Login = () => {
  const { logInUser, setLoader } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [loginError, setLoginError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoginError(""); 
      await logInUser(data.email, data.password);
      navigate(from, { replace: true });
      setLoader(false);
    } catch (error) {
      console.error("Login failed", error);
      setLoginError("Invalid email or password");
      setLoader(false);
    }
  };

  return (
    <div  className="w-full min-h-screen p-5 lg:p-28 overflow-hidden">
      <div className="border-2 border-black shadow-xl w-full h-full overflow-hidden py-8 px-5 lg:px-20 grid grid-cols-1 md:grid-cols-2 justify-center items-center gap-8">
        <div>
          <img src={img} alt="" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-center">Login</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-lg" htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                {...register("email", { required: "Email is required" })}
                className="w-full text-xl p-2 rounded-md"
              />
              {errors.email && <span className="text-red-500">{errors.email.message}</span>}
            </div>
            <div>
              <label className="block text-lg" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="Password"
                  {...register("password", { required: "Password is required" })}
                  className="w-full text-xl p-2 rounded-md"
                />
                <span
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                </span>
              </div>
              {errors.password && <span className="text-red-500">{errors.password.message}</span>}
            </div>
            {loginError && <p className="text-red-500">{loginError}</p>}
            <div className="text-center">
              <Button
                className="!bg-blue-700/50 !text-white"
                htmlType="submit"  
              >
                Login
              </Button>
            </div>
          </form>
          <p className="text-center">Don&apos;t have an account? <Link to="/register" className="text-blue-500 underline" >Register</Link></p>
          <div className="text-center my-4 space-y-4">
            <p>Or sign in with</p>
            <SocialLogin />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
