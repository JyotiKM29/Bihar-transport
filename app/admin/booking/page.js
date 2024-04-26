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
import AdvanceBooking from './advanceBooking/page';

function Booking() {
  const [selectedTab, setSelectedTab] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  let tabValue = searchParams.get("tab");
  if (!tabValue) tabValue = "newbooking";
  // console.log('search :',tabValue);
  // console.log('selectedTab :',selectedTab);

  useEffect(() => {
   
    setSelectedTab(tabValue);

  }, [tabValue , selectedTab]);

  const handleTabChange = (value) => {
    setSelectedTab(value);

    router.push(`/admin/booking?tab=${value?.toLowerCase()}`);
  };

  return (
    <div className="min-h-[95vh] w-full">
      <Tabs value={selectedTab} className="relative min-h-full w-full">
        <TabsList className="flex flex-wrap justify-center rounded-2xl">
          <TabsTrigger
            value="newbooking"
            onClick={() => handleTabChange("newbooking")}
          >
            New Booking
          </TabsTrigger>
          <TabsTrigger
            value="advancebooking"
            onClick={() => handleTabChange("advancebooking")}
          >
            Advance Bookings
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            onClick={() => handleTabChange("pending")}
          >
            Pending Bookings
          </TabsTrigger>
          <TabsTrigger
            value="confirm"
            onClick={() => handleTabChange("confirm")}
          >
            Confirm Bookings
          </TabsTrigger>
          <TabsTrigger
            value="intilize"
            onClick={() => handleTabChange("intilize")}
          >
            Pending for Dispatch
          </TabsTrigger>
          <TabsTrigger
            value="dispatch"
            onClick={() => handleTabChange("dispatch")}
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
            value="delivered"
            onClick={() => handleTabChange("delivered")}
          >
            Delivered Bookings
          </TabsTrigger>
          <TabsTrigger
            value="cancelled"
            onClick={() => handleTabChange("cancelled")}
          >
            Cancelled Bookings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="newbooking">
          <NewBooking />
        </TabsContent>
        <TabsContent value="advancebooking">
          <AdvanceBooking />
        </TabsContent>
        <TabsContent value="pending">
          <PendingBooking />
        </TabsContent>
        <TabsContent value="confirm">
          <ConfirmBooking />
        </TabsContent>
        <TabsContent value="intilize">
          <InitializeBooking />
        </TabsContent>
        <TabsContent value="dispatch">
          <DispatchBooking />
        </TabsContent>
        <TabsContent value="intransist">
          <IntransitBooking />
        </TabsContent>
        <TabsContent value="delivered">
          <DeliveredBooking />
        </TabsContent>
        <TabsContent value="cancelled">
          <CancelledBooking />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Booking;
