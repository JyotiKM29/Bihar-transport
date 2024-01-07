"use client";
import React, { useState } from "react";
import { useToast } from "../components/ui/use-toast";

import InputField from "../component/fields/InputField";

import Link from "next/link";
import { Toast } from "@radix-ui/react-toast";
import { useRouter } from "next/navigation";

// ...other imports

const Signup = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !phone || !password) {
      return displayToast('Fill all fields', '🥲');
    }

    try {
      const response = await sendSignupRequest();
      const result = await response.json();
      // console.log(response);
      console.log(result);

      if (result.status ==='ok') {
        // const data = await response.json();
        console.log('Data:', result);
        displayToast('Successfully Created', '✅');
        router.push("/admin");

      } else {
        console.error('Error occurred:', result.msg);
        displayToast('Error occurred', '❌', result.message);
      }
    } catch (error) {
      console.error('Error:', error.message);
      displayToast('Error', '❌', error.message);
    }
  };

  const displayToast = (title, action, description = '') => {
    toast({
      title,
      action,
      description,
    });
  };

  const sendSignupRequest = async () => {
    return fetch('api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
    <div className="flex h-screen w-screen items-center justify-center px-4 bg-gradient-to-r from-sky-500 to-indigo-500">
      {/* Sign in section */}
      <form
        className="mt-[10vh] w-full flex-col items-center md:max-w-[420px] border py-4 px-8 md:py-8 md:px-16 rounded-3xl bg-white"
        onSubmit={handleFormSubmit}
      >
      <h4 className="mb-2.5 text-4xl font-bold text-navy-700 ">Sign Up</h4>
           <p className="mb-4 ml-1 text-base text-gray-600">
             create your account for sign in !
           </p>

           {/* Name */}
           <InputField
             variant="auth"
             extra="mb-3"
             label="Name"
             placeholder="Enter your name"
             id="name"
             type="text"
             value={name}
             onChange={(e) => setName(e.target.value)}
           />

           {/* Email */}
           <InputField
             variant="auth"
             extra="mb-3"
             label="Email"
             placeholder="Enter your Email"
             id="email"
             type="text"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
           />

           {/* Password */}
           <InputField
             variant="auth"
             extra="mb-3"
             label="Password"
             placeholder="Enter your password"
             id="password"
             type="password"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
           />
           {/* Phone no*/}
           <InputField
             variant="auth"
             extra="mb-3"
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
          Sign Up
        </button>
        
        <div className="mt-4 flex items-center justify-center">
          <span className="text-sm font-medium text-navy-700">
            Already have an account?
          </span>
          <Link
            href="/"
            className="ml-1 text-sm font-medium text-blue-500 hover:text-brand-600"
          >
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;

