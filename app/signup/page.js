import React from 'react'
import { FcGoogle } from "react-icons/fc";
import InputField from '../component/fields/InputField';

import Link from 'next/link';

const Signup = () => {
  return (
    <div className=" flex h-screen w-screen items-center justify-center px-4  bg-gradient-to-r from-sky-500 to-indigo-500">
    {/* Sign in section */}
    <form className="mt-[10vh] w-full  flex-col items-center  md:max-w-[420px] border  py-4 px-8 md:py-8 md:px-16 rounded-3xl bg-white">
      <h4 className="mb-2.5 text-4xl font-bold text-navy-700 ">
        Sign Up
      </h4>
      <p className="mb-4 ml-1 text-base text-gray-600">
        create your account for sign in !
      </p>
    
      {/* Name */}
      <InputField
        variant="auth"
        extra="mb-3"
        label="Name"
        placeholder="Enter your name"
        id="email"
        type="text"
      />
      {/* Email */}
      <InputField
        variant="auth"
        extra="mb-3"
        label="Email"
        placeholder="Enter your Email"
        id="email"
        type="text"
      />

      {/* Password */}
      <InputField
        variant="auth"
        extra="mb-3"
        label="Password"
        placeholder="Enter your password"
        id="password"
        type="password"
      />
      
     
      <button className="linear mt-2 w-full rounded-xl bg-blue-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-blue-600 active:bg-blue-700">
        Sign Up
      </button>
      <div className="mt-4 flex items-center justify-center">
        <span className=" text-sm font-medium text-navy-700 ">
          Already have account ?
        </span>
        <Link
          href="/signin"
          className="ml-1 text-sm font-medium text-blue-500 hover:text-brand-600 "
        >
          Sign In
        </Link>
      </div>
    </form>
  </div>
  )
}

export default Signup
