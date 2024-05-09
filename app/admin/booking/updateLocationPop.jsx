"use client";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { UserContext } from "../../context/UserContextProvider";
import { useToast } from "../../components/ui/use-toast";

const UpdateLocationPop = ({ bookingId }) => {
  const [reason, setReason] = useState("");
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [selectedTime, setSelectedTime] = useState(getCurrentTime());
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
    console.log(userId, reason, bookingId, selectedDate, selectedTime);

    try {
      setLoading(true);
      console.log(
        JSON.stringify({
          adminId: userId,
          bookingId,
          location:reason,
          selectedDate,
          selectedTime,
        }),
      );

      const response = await fetch("/api/location", {
        method: "POST",
        body: JSON.stringify({
          adminId: userId,
          bookingId,
          location:reason,
          date:selectedDate,
          time:selectedTime,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        displayToast("Successfully updated location", "✅");
      } else {
        console.error("Error:", result.message);
        displayToast("failed to update location ", "❌", result.message);
      }
    } catch (error) {
      console.error("Error:", error.message);
      displayToast("Server Error", "❌", error.message);
    } finally {
      setLoading(false);
    }
  }

  // Function to get current date in YYYY-MM-DD format
  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Function to get current time in HH:MM format
  function getCurrentTime() {
    const today = new Date();
    const hours = String(today.getHours()).padStart(2, "0");
    const minutes = String(today.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="rounded bg-red-500 p-2 px-4 text-white">
          {" "}
          Update Location
        </span>
      </DialogTrigger>
      <DialogContent className="w-[80vw]">
        <div className="h-full w-full rounded-3xl  bg-white ">
          <h2 className="font-semiBold  mt-12 text-2xl text-blue-800 lg:mt-4 lg:font-medium">
            Enter the Recent Location :
          </h2>

          <div className=" w-full rounded-3xl bg-white px-6 py-4  ">
            <form
              onSubmit={handleSubmit}
              className=" flex w-full flex-col items-start justify-between self-end rounded-xl  px-6 py-4  "
            >
              <label className="w-full items-center gap-4 md:flex">
                <Input
                  label="Reason"
                  placeholder="Where is booking right now ?"
                  id="email"
                  type="text"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full"
                />
              </label>
              <label className="w-full items-center gap-8 md:flex">
                <span>Date:</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="block w-full rounded-md border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </label>
              <label className="w-full items-center gap-8 md:flex">
                <span>Time:</span>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="block w-full rounded-md border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </label>
              <Button type="submit">
                {loading ? "Loading ..." : "Update Location"}
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateLocationPop;
