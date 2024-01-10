"use client";
import { Button } from "./components/ui/button";
import React, { use, useState } from "react";
import { FcGoogle } from "react-icons/fc";
// import InputField from "./component/fields/InputField";
import { Input } from "./components/ui/input";

import Link from "next/link";
import { useToast } from "./components/ui/use-toast";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const token = process.env.ipToken;
  
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    

    try {


      
     const response = await fetch("https://ipinfo.io?token=e5af198d08144e", {
       method: "GET",
       headers: {
         "Content-Type": "application/json",
       },
     });


      const data = await response.json();
      console.log(data);

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

      console.log(result);
         console.log(email, password);

      const newResult = await result.json();

     if (result.ok) {
       setLoading(false);
       displayToast("Successfully login ", "✅");
       router.push("/admin");
     } else {
       setLoading(false);
       console.log("Error:", newResult.message);
       displayToast("Error", "❌", newResult.message);
     }

      // router.push("/admin")

      console.log(newResult);
    } catch (error) {
      setLoading(false);
      console.error("Error:", error.message);
      displayToast("Error", "❌", error.message);
    }
    setLoading(false);
 
  }

  const displayToast = (title, action, description = "") => {
    toast({
      title,
      action,
      description,
    });
  };

  return (
    <div className=" flex h-screen w-screen items-center justify-center bg-gradient-to-r  from-sky-500 to-indigo-500 px-4">
      {/* Sign in section */}
      <form
        className="mt-[10vh] w-full  flex-col items-center  rounded-3xl border  bg-white px-8 py-4 md:max-w-[420px] md:px-12 md:py-8"
        onSubmit={handleSubmit}
      >
        <h4 className="text-navy-700 mb-2.5 text-4xl font-bold ">Sign In</h4>
        <p className="mb-4 ml-1 text-base text-gray-600">
          Enter your email and password to sign in!
        </p>

        {/* Email */}
        <Input
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
        <Input
          className="mt-3"
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
            className="text-nowrap text-sm font-medium text-blue-500 hover:text-blue-600 "
            href=" "
          >
            Forgot Password?
          </Link>
        </div>
        <Button
          className="linear mt-2 w-full rounded-xl bg-blue-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-blue-600 active:bg-blue-700"
          type="submit"
        >
          {loading ? "Loading ..." : "Sign In"}
        </Button>
        <div className="mt-4 flex items-center justify-center">
          <span className=" text-navy-700 text-sm font-medium ">
            Not registered yet?
          </span>
          <Link
            href="/signup"
            className="hover:text-brand-600 ml-1 text-sm font-medium text-blue-500 "
          >
            Create an account
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
