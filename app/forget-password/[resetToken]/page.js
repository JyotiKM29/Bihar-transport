"use client";
import { Button } from "./../../components/ui/button";
import React, {  useState } from "react";
import { Input } from "./../../components/ui/input";


import Link from "next/link";
import { useToast } from "./../../components/ui/use-toast";
import { useRouter } from "next/navigation";
import { SpeedInsights } from "@vercel/speed-insights/next";

const ResetPassword = ({params}) => {
  const resetToken = params.resetToken;
  const router = useRouter();
  const { toast } = useToast();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

 
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    if(newPassword !== confirmPassword){
        displayToast("Password don't Match", "❌" );
        return ;
    }

    try {
    const result = await fetch("/api/resetpassword",
    {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          newPassword,
          resetToken,
          confirmPassword,
        }),
      });

      const newResult = await result.json();
  
      if (result.ok) {
        setLoading(false);
        displayToast("Reset password sent on your mail! ", "✅");
        
       

        router.push("/");
      } else {
        setLoading(false);
        console.error("Error:", newResult.message);
        displayToast("Error", "❌", newResult.message);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error:", error.message);
      displayToast("fail to Updated password", "❌", error.message);
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
   
    <SpeedInsights />
    <form
      className="mt-[10vh] w-full  flex-col items-center  rounded-3xl border  bg-white px-8 py-4 md:max-w-[420px] md:px-12 md:py-8"
      onSubmit={handleSubmit}
    >
      <h4 className="text-navy-700 mb-2.5 text-4xl font-bold ">Forget password</h4>
      <p className="mb-4 ml-1 text-base text-gray-600">
       Please, Enter your email here
      </p>
 {/* Password */}
       <Input
          label="Password"
          placeholder="password"
         
          type="password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
 {/* Confirm password */}
        <Input
          label="Confirm Password"
          placeholder="confirm password"
         
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

      
    
   
      <Button
        className="linear mt-2 w-full rounded-xl bg-blue-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-blue-600 active:bg-blue-700"
        type="submit"
      >
        {loading ? "Loading ..." : "Update Password"}
      </Button>
     
    </form>
  </div>
  )
}

export default ResetPassword
