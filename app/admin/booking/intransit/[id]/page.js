"use client";
import { useToast } from "../../../../components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ViewDetail from '../../ViewDetail';

const BookingDetails = ({ params }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editBooking, setEditBooking] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/bookingdetails/${params.id}`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setLoading(false);
        setBookingDetails(data);
        displayToast("Fetch Booking Detail Succesfully ", "✅");

        console.log("data", data);
      } catch (error) {
        setLoading(false);
        console.error("Error:", error);
        displayToast("Error in Fetching Data", "❌", error.message);
      }
    };
    fetchData();
  }, [params.id]);

  const displayToast = (title, action, description = "") => {
    toast({
      title,
      action,
      description,
    });
  };

  
  return (
    <div className="min-h-[90vh] w-full rounded-2xl bg-white px-6 py-4 shadow-sm ">

      {loading ? 'Loading...':  <ViewDetail  bookingDetails={bookingDetails}  heading={"InTransit booking"}/>}
     
    </div>
  );
};

export default BookingDetails;
