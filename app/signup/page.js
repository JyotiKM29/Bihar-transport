"use client";
import React, { useContext, useState } from "react";
import { useToast } from "../components/ui/use-toast";

import { Input, Label } from "../components/ui/input";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserContext } from "../context/UserContextProvider";

const Signup = () => {
  const { setUser } = useContext(UserContext);
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!name || !email || !phone || !password) {
      setLoading(false);

      return displayToast("Fill all fields", "🥲");
    }

    try {
      const response = await sendSignupRequest();
      const result = await response.json();
      // console.log(response);
      console.log(result);

      if (response.ok) {
        // const data = await response.json();
        setLoading(false);
        console.log("Data:", result);
        displayToast(
          "Successfully created, Please ask owner to assign you admin role. Then login",
          "✅",
        );
        router.push("/");
      } else {
        setLoading(false);
        console.error("Error occurred:", result.message);
        displayToast("Error occurred", "❌", result.message);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error:", result.message);
      displayToast("Error", "❌", result.message);
    }
    setLoading(false);
  };

  const displayToast = (title, action, description = "") => {
    toast({
      title,
      action,
      description,
    });
  };

  const sendSignupRequest = async () => {
    return fetch("api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        phone,
      }),
    });
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-r from-sky-500 to-indigo-500 px-4">
      {/* Sign in section */}
      <form
        className="mt-[10vh] w-full flex-col items-center rounded-3xl border bg-white px-8 py-4 md:max-w-[420px] md:px-16 md:py-8"
        onSubmit={handleFormSubmit}
      >
        <h4 className="text-navy-700 mb-2.5 text-4xl font-bold ">Sign Up</h4>
        <p className="mb-4 ml-1 text-base text-gray-600">
          create your account for sign in !
        </p>

        {/* Name */}
        <Input
          required
          label="Name"
          placeholder="Enter your name"
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Email */}
        <Input
          required
          label="Email"
          placeholder="Enter your Email"
          id="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
     


        <Input
          required
          label="Password"
          placeholder="Enter your password"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* Phone no*/}
        <Input
          required
          label="Phone no"
          placeholder="Enter your phone no"
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button
          className="linear mt-2 w-full rounded-xl bg-blue-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-blue-600 active:bg-blue-700"
          type="submit"
        >
          {loading ? "Loading ..." : " Sign Up"}
        </button>

        <div className="mt-4 flex items-center justify-center">
          <span className="text-navy-700 text-sm font-medium">
            Already have an account?
          </span>
          <Link
            href="/"
            className="hover:text-brand-600 ml-1 text-sm font-medium text-blue-500"
          >
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
