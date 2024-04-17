"use client";
import React, { useEffect, useState, useContext } from "react";
import { Button } from "../../../components/ui/button";
import { IoIosArrowBack } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { useToast } from "../../../components/ui/use-toast";
import { useRouter } from "next/navigation";
import ViewDetail from "../ViewDetail"; // Import the ViewDetail component
import { UserContext } from "../../../context/UserContextProvider";

const Page = ({ params }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editBooking, setEditBooking] = useState(false);
  const { user } = useContext(UserContext);
  const [userId, setUserId] = useState(null); // State to hold userId

  // getting the userid from the Context
  useEffect(() => {
    if (user && user._id) {
      setUserId(user._id); // Set userId if user context is available
    }
  }, [user]);

  useEffect(() => {
    if (!userId) {
      setLoading(true);
      // If userId is not available yet, return
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/quote/getOne/adminId=${userId}&&_id=${params.quoteid}`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        if (response.ok) {
          console.log(data.data);
          setLoading(false);
          setBookingDetails(data.data);
          displayToast("Fetch Booking Detail Succesfully ", "✅");
        } else {
          setLoading(false);
          console.error("Error: ", response);
          displayToast("Error in Fetching Data", "❌", data.message);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error:", error);
        displayToast("Error in Fetching Data", "❌", error.message);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId, params.quoteid]); // Update params.quoteid to params.id

  const displayToast = (title, action, description = "") => {
    toast({
      title,
      action,
      description,
    });
  };

  return (
    <div className="min-h-[90vh] w-full rounded-2xl bg-white px-6 py-4 shadow-sm ">
      {userId && loading ? (
        "Loading..."
      ) : (
        // "suraj"
        <ViewDetail bookingDetails={bookingDetails} heading={"Quotation "} />
      )}
    </div>
  );
};

export default Page;
