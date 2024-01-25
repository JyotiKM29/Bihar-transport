"use client";
import { Button } from "../../components/ui/button";
import React, {  useState } from "react";
import { Input } from "../../components/ui/input";
import { useToast } from "../../components/ui/use-toast";
import { useRouter } from "next/navigation";
import { SpeedInsights } from "@vercel/speed-insights/next";


const ResetPassword = ({params}) => {
  const [hide , setHide] = useState(true)
  const resetToken = params.otp;
  const router = useRouter();
  const { toast } = useToast();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // console.log('love',resetToken)
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    if(newPassword !== confirmPassword){
        displayToast("Password don't Match", "❌" );
        return ;
    }
    console.log(resetToken)

    try {
    const result = await fetch("/api/resetpassword",
    {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          resetToken,
          newPassword,
         
          confirmPassword,
        }),
      });

      const newResult = await result.json();
      console.log(newResult)
  
      if (result.ok) {
        setLoading(false);
        displayToast("Password Updated ", "✅");
        
       

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


      <div className="relative flex ">
      <Input
          label="Password"
          placeholder="password"
         
          type={hide ? "password" : "text"}
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
          <span
            className="absolute right-2 top-1/2 -translate-y-1/2 transform"
            onClick={() => setHide(!hide)}
          >
            {hide ? "Show" : "Hide"}
          </span>
        </div>
        <div className="relative flex ">
        <Input
          label="Confirm Password"
          placeholder="confirm password"
         
          type={hide ? "password" : "text"}
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
          <span
            className="absolute right-2 top-1/2 -translate-y-1/2 transform"
            onClick={() => setHide(!hide)}
          >
            {hide ? "Show" : "Hide"}
          </span>
        </div>
      

      
    
   
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
