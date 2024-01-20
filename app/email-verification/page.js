"use client";
import { Button } from "./../components/ui/button";
import React, { useState } from "react";
import { Input } from "./../components/ui/input";
import { useToast } from "./../components/ui/use-toast";
import { useRouter } from "next/navigation";




const EmailVerification = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [otp, setOtp] = useState();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
  
    try {
      const result = await fetch(`/api/emailverification/${otp}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        
      });
  
      const newResult = await result.json();
  
      if (result.ok) {
        setLoading(false);
        displayToast("email verified Successfully ", "✅");
  
        router.push("/");
      } else {
        setLoading(false);
        console.error("Error:", newResult.message);
        displayToast("Fail to Verify email", "❌", newResult.message);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error:", error.message);
      displayToast("Fail to Verify email", "❌", error.message);
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
      <form
        className="mt-[10vh] w-full  flex-col items-center  rounded-3xl border  bg-white px-8 py-4 md:max-w-[420px] md:px-12 md:py-8"
        onSubmit={handleSubmit}
      >
        <h4 className="text-nowrap text-navy-700 mb-2.5 text-4xl font-bold ">
          Email Verification
        </h4>
        <p className="mb-4 ml-1 text-base text-gray-600">
          Please, Enter your Otp here
        </p>

        <Input
          label="Otp"
          placeholder="Enter Otp"
          onInput={(e) => {
            const object = e.target;
            if (object.value.length > object.maxLength)
              object.value = object.value.slice(0, object.maxLength);
          }}
          maxLength={6}
          type="number"
          required
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <Button
          className="linear mt-2 w-full rounded-xl bg-blue-500 py-6 text-base font-medium text-white transition duration-200 hover:bg-blue-600 active:bg-blue-700"
          type="submit"

          disabled={otp?.length !== 6}
        >
          {loading ? "Loading ..." : "Submit OTP"}
        </Button>
      </form>
    </div>
  );
};

export default EmailVerification;
