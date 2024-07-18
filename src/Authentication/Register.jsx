import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import useAuth from "../Hooks/useAuth";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import Swal from "sweetalert2";
import { Button } from "antd";
import img from "../assets/register.svg";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Loading from "../Component/Loading";
import SocialLogin from "../Component/SocialLogin";

const Register = () => {
  const { registerUser, profileUpdate, loader, setLoader } = useAuth();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const photo = watch("photo");

  const handleRegister = async (data) => {
    try {
      const formData = new FormData();
      formData.append("image", data.photo[0]);

      const imgBBResponse = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_KEY}`,
        formData
      );
      const imageUrl = imgBBResponse.data.data.url;

      await registerUser(data.email, data.pin).then((result) => {
        setLoader(false);
      });
      await profileUpdate(data.name, imageUrl);

      await axiosPublic
        .post("/users", {
          name: data.name,
          email: data.email,
          pin: data.pin,
          mobileNumber: data.mobileNumber,
          status: "pending",
          photo: imageUrl,
        })
        .then((res) => {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "User created successfully",
            showConfirmButton: false,
            timer: 1500,
          });
          navigate("/");
        });
    } catch (error) {
      console.error("Error registering user:", error);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Error creating user",
        showConfirmButton: true,
      });
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full min-h-screen p-5 lg:p-28 overflow-hidden">
      <div className="border-2 border-black shadow-2xl w-full h-full overflow-hidden py-8 px-5 lg:px-20 grid grid-cols-1 md:grid-cols-2 justify-center items-center gap-8">
        <div>
          <img className="" src={img} alt="" />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-center">Register</h1>
          <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-lg" htmlFor="name">
                Name
              </label>
              <input
                {...register("name", { required: true })}
                id="name"
                placeholder="Name"
                className="w-full p-2 border rounded-md"
              />
              {errors.name && (
                <span className="text-red-600">Name is required</span>
              )}
            </div>

            {/* Photo */}
            {/* <div>
              <label className="block text-lg" htmlFor="photo">
                Photo
              </label>
              <input
                {...register("photo", { required: true })}
                type="file"
                id="photo"
                className="w-full p-2 border rounded-md"
              />
              {errors.photo && (
                <span className="text-red-600">Photo is required</span>
              )}
            </div> */}

            {/* Email */}
            <div>
              <label className="block text-lg" htmlFor="email">
                Email
              </label>
              <input
                {...register("email", { required: true })}
                type="email"
                id="email"
                placeholder="Email"
                className="w-full p-2 border rounded-md"
              />
              {errors.email && (
                <span className="text-red-600">Email is required</span>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-lg" htmlFor="mobileNumber">
                Mobile Number
              </label>
              <input
                {...register("mobileNumber", { required: true })}
                type="text"
                id="mobileNumber"
                placeholder="Mobile Number"
                className="w-full p-2 border rounded-md"
              />
              {errors.mobileNumber && (
                <span className="text-red-600">Mobile Number is required</span>
              )}
            </div>

            {/* PIN */}
            <div>
              <label className="block text-lg" htmlFor="pin">
                PIN
              </label>
              <div className="relative">
                <input
                  {...register("pin", {
                    required: "PIN is required",
                    pattern: {
                      value: /^\d{5}$/,
                      message: "PIN must be a 5-digit number",
                    },
                  })}
                  type={showPassword ? "text" : "password"}
                  id="pin"
                  placeholder="PIN"
                  className="w-full p-2 border rounded-md"
                />
                <span
                  onClick={toggleShowPassword}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {errors.pin && (
                <span className="text-red-600">{errors.pin.message}</span>
              )}
            </div>

            {/* role */}
            <div>
              <label className="block text-lg" htmlFor="role">
                Role
              </label>
              <select
                value={watch("role")}
                onChange={(value) => setValue("role", value)}
                id="role"
                placeholder="Select Role"
                className="w-full p-2 border rounded-md"
                {...register("role", { required: true })}
              >
                <option value="user">User</option>
                <option value="agent">Agent</option>
              </select>
              {errors.role && (
                <span className="text-red-600">Role is required</span>
              )}
            </div>

            <div className="text-center">
              <Button
                className="!bg-blue-700/50 !text-white"
                type="primary"
                htmlType="submit"
              >
                {/* {loader ? <Loading /> : "Register"} */}
                Register
              </Button>
            </div>
          </form>
          <p className="text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 underline">
              Login
            </Link>
          </p>

          <div className="text-center my-4 space-y-4">
            <p>Or sign in with</p>
            <SocialLogin />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
