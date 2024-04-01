"use client";
import React, { useState, useEffect } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { useRouter } from "next/navigation";
import NewBooking from "./new-booking/page";
import PendingBooking from "./pending/page";
import InitializeBooking from "./intilize/page";
import ConfirmBooking from "./confirm/page";
import DispatchBooking from "./dispatch/page";
import IntransitBooking from "./intransit/page";
import DeliveredBooking from "./delivered/page";
import CancelledBooking from "./cancelled/page";
import { useSearchParams } from "next/navigation";

function Booking() {
  const [selectedTab, setSelectedTab] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabValue = searchParams.get("tab");
  console.log(tabValue);

  useEffect(() => {
   
    setSelectedTab(tabValue);
  }, [searchParams]);

  const handleTabChange = (value) => {
    setSelectedTab(value);

    router.push(`/admin/booking?tab=${value?.toLowerCase()}`);
  };

  return (
    <div className="min-h-[95vh] w-full">
      <Tabs defaultValue={selectedTab} className="relative min-h-full w-full">
        <TabsList className="flex flex-wrap justify-center rounded-2xl">
          <TabsTrigger
            value="Booking"
            onClick={() => handleTabChange("newBooking")}
          >
            New Booking
          </TabsTrigger>
          <TabsTrigger
            value="Pending"
            onClick={() => handleTabChange("Pending")}
          >
            Pending Bookings
          </TabsTrigger>
          <TabsTrigger
            value="Confirm"
            onClick={() => handleTabChange("Confirm")}
          >
            Confirm Bookings
          </TabsTrigger>
          <TabsTrigger
            value="Intilize"
            onClick={() => handleTabChange("Intilize")}
          >
            Intilize Bookings
          </TabsTrigger>
          <TabsTrigger
            value="Dispatch"
            onClick={() => handleTabChange("Dispatch")}
          >
            Dispatch Bookings
          </TabsTrigger>
          <TabsTrigger
            value="intransist"
            onClick={() => handleTabChange("intransist")}
          >
            In-Transist Bookings
          </TabsTrigger>
          <TabsTrigger
            value="Delivered"
            onClick={() => handleTabChange("Delivered")}
          >
            Delivered Bookings
          </TabsTrigger>
          <TabsTrigger
            value="Cancelled"
            onClick={() => handleTabChange("Cancelled")}
          >
            Cancelled Bookings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="Booking">
          <NewBooking />
        </TabsContent>
        <TabsContent value="Pending">
          <PendingBooking />
        </TabsContent>
        <TabsContent value="Confirm">
          <ConfirmBooking />
        </TabsContent>
        <TabsContent value="Intilize">
          <InitializeBooking />
        </TabsContent>
        <TabsContent value="Dispatch">
          <DispatchBooking />
        </TabsContent>
        <TabsContent value="intransist">
          <IntransitBooking />
        </TabsContent>
        <TabsContent value="Delivered">
          <DeliveredBooking />
        </TabsContent>
        <TabsContent value="Cancelled">
          <CancelledBooking />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Booking;
