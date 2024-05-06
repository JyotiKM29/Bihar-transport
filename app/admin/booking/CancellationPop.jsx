'use client'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../../components/ui/dialog"
import { Input } from "../../components/ui/input"
import React, { useContext, useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { UserContext } from "../../context/UserContextProvider";
import { useToast } from "../../components/ui/use-toast";



const CancellationPop = ({bookingId}) => {

  const [reason ,setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useContext(UserContext);

  const userId = user?._id;
  // const bookingId = bookingId;
  const displayToast = (title, action, description = "") => {
    toast({
      title,
      action,
      description,
    });
  };


  async function handleSubmit(e) {
    e.preventDefault();
    console.log(userId,reason,bookingId);

    try {
        setLoading(true);
        console.log(
          JSON.stringify({
            adminId: userId,
            bookingId,
            reason,
          }),
        );

      const response = await fetch("/api/cancelBooking", {
        method: "POST",
        body: JSON.stringify({
          adminId: userId,
          bookingId,
          reason,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        displayToast("Successfully Cancelled booking", "✅");
      } else {
        console.error("Error:", result.message);
        displayToast("failed to cancel ", "❌", result.message);
      }
    } catch (error) {
      console.error("Error:", error.message);
      displayToast("Server Error", "❌", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog >
    <DialogTrigger asChild>
      <span className="bg-red-500 p-2 px-4 text-white rounded"> Cancel Booking</span>
    </DialogTrigger>
    <DialogContent className='w-[80vw]' >
    <div className="h-full w-full rounded-3xl  bg-white ">
      <h2 className="font-semiBold  mt-12 text-2xl lg:mt-4 text-blue-800 lg:font-medium">
      Why do you want to cancel the booking ?
      </h2>
    
      
      <div className=" w-full rounded-3xl bg-white px-6 py-4  ">
     

      <form
        onSubmit={handleSubmit}
        className=" flex w-full flex-col items-start justify-between self-end rounded-xl  px-6 py-4  "
      >
        <label className="w-full items-center gap-4 md:flex">
          <Input
            label="Reason"
            placeholder="Enter your Reason"
            id="email"
            type="text"
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full"
          />
        </label>
        <Button type="submit">
          {loading ? "Loading ..." : "Cancel Booking"}
        </Button>
      </form>
    </div>
   
    </div>
    </DialogContent>
  </Dialog>
  )
}

export default CancellationPop