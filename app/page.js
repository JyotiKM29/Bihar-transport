"use client";
import { Button } from "./components/ui/button";
import React, { useContext, useState } from "react";
import { Input } from "./components/ui/input";
import { UserContext } from "./context/UserContextProvider";

import Link from "next/link";
import { useToast } from "./components/ui/use-toast";
import { useRouter } from "next/navigation";
import { SpeedInsights } from "@vercel/speed-insights/next";

const SignIn = () => {
  const [hide, setHide] = useState(true);
  const { user, setUser } = useContext(UserContext);

  

  const router = useRouter();
  const { toast } = useToast();
  //set default password and email so , that User can check inside details , even then Owner not llowed them 
  
  const [email, setEmail] = useState("jyotikumari4442@gmail.com");
  const [password, setPassword] = useState("567890");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      let ip = null;
      let location = null;

      try {
        const response = await fetch("https://ipinfo.io?token=e5af198d08144e", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          ip = data.ip || null;
          location = data.city || null;
        } else {
          console.log("IP Fetching failed");
        }
      } catch (error) {
        console.error("Error fetching IP:", error.message);
      }

      const result = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
          ip,
          location,
        }),
      });

      const newResult = await result.json();

      if (result.ok) {
        setLoading(false);
        displayToast("Successfully login ", "✅");
        const userDetail = newResult.user;
        localStorage.setItem("userInfo", JSON.stringify(userDetail));
        setUser(userDetail);

        router.push("/admin");
      } else {
        setLoading(false);
        console.error("Error:", newResult.message);
        displayToast("Error", "❌", newResult.message);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error:", error.message);
      displayToast("Error", "❌", error.message);
    }
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
      <SpeedInsights />
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
          label="Email"
          placeholder="youremail@gmail.com"
          id="email"
          type="text"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <div className="relative flex ">
          <Input
            label="Password"
            placeholder="password"
            id="password"
            type={hide ? "password" : "text"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="absolute right-2 top-1/2 -translate-y-1/2 transform"
            onClick={() => setHide(!hide)}
          >
            {hide ? "Show" : "Hide"}
          </span>
        </div>
        {/* Checkbox */}
        <div className="mb-4 flex items-center justify-end px-2">
          <Link
            className="text-nowrap text-sm font-medium text-blue-500 hover:text-blue-600 "
            href="/forget-password"
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
