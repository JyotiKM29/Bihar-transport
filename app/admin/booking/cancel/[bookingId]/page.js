"use client";
import React, { useContext, useEffect, useState } from "react";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { UserContext } from "../../../../context/UserContextProvider";
import { useToast } from "../../../../components/ui/use-toast";

const EmailSend = ({ params }) => {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useContext(UserContext);

  const userId = user?._id;
  const bookingId = params.bookingId;
  const displayToast = (title, action, description = "") => {
    toast({
      title,
      action,
      description,
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(userId,email,userName,bookingId);

    try {
        setLoading(true);
        console.log(
          JSON.stringify({
            adminId: userId,
            bookingId,
            reason: email,
          }),
        );

      const response = await fetch("/api/cancelBooking", {
        method: "POST",
        body: JSON.stringify({
          adminId: userId,
          bookingId,
          reason:email,
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
    <div className="h-full w-full rounded-3xl bg-white px-6 py-4  shadow-sm">
      <h2 className="font-semiBold mt-12 text-3xl lg:mt-0 text-blue-600 "> Why do you want to cancel the booking ? : </h2>

      <form
        onSubmit={handleSubmit}
        className="mt-8 flex w-full flex-col items-start justify-between self-end rounded-xl border px-6 py-4  shadow-md"
      >
        <label className="w-full items-center gap-4 md:flex">
          {/* <p className="font-semiBold text-nowrap text-lg">User Name :</p> */}
          <Input
            label="Reason"
            placeholder="Enter your Reason"
            id="email"
            type="text"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
          />
        </label>
        <Button type="submit">
          {loading ? "Loading ..." : "Cancel Booking"}
        </Button>
      </form>
    </div>
  );
};

export default EmailSend;
