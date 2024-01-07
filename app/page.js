"use client";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import InputField from "./component/fields/InputField";
import { FaCheck } from "react-icons/fa6";

import Link from "next/link";
import Checkbox from "./component/fields/Checkbox";
import { useToast } from "./components/ui/use-toast";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://ipinfo.io/152.58.119.235?token=e5af198d08144e",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      // console.log(data);

      const ip = data.ip || null;
      const location = data.city || null;
      // console.log(ip, location);

      const result = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          ip,
          location,
        }),
      });

      const newResult  = await result.json();

      

      // router.push("/admin")

      console.log(newResult);

    } catch (error) {
      console.error("Error:", error.message);
    }

    console.log(email, password);
  }

  return (
    <div className=" flex h-screen w-screen items-center justify-center px-4  bg-gradient-to-r from-sky-500 to-indigo-500">
      {/* Sign in section */}
      <form
        className="mt-[10vh] w-full  flex-col items-center  md:max-w-[420px] border  py-4 px-8 md:py-8 md:px-12 rounded-3xl bg-white"
        onSubmit={handleSubmit}
      >
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 ">Sign In</h4>
        <p className="mb-4 ml-1 text-base text-gray-600">
          Enter your email and password to sign in!
        </p>

        {/* Email */}
        <InputField
          variant="auth"
          extra="mb-3"
          label="Email*"
          placeholder="youremail@gmail.com"
          id="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <InputField
          variant="auth"
          extra="mb-3"
          label="Password*"
          placeholder="password"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* Checkbox */}
        <div className="mb-4 flex items-center justify-end px-2">
          <Link
            className="text-sm font-medium text-nowrap text-blue-500 hover:text-blue-600 "
            href=" "
          >
            Forgot Password?
          </Link>
        </div>
        <button
          className="linear mt-2 w-full rounded-xl bg-blue-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-blue-600 active:bg-blue-700"
          type="submit"
        >
          Sign In
        </button>
        <div className="mt-4 flex items-center justify-center">
          <span className=" text-sm font-medium text-navy-700 ">
            Not registered yet?
          </span>
          <Link
            href="/signup"
            className="ml-1 text-sm font-medium text-blue-500 hover:text-brand-600 "
          >
            Create an account
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
