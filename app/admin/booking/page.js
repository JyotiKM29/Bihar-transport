import React from 'react'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import NewBooking  from './new-booking/page'
import CompanyBooking  from './company/page'
import PendingBooking  from './pending/page'
import IntilizeBooking  from './intilize/page'
import ConfirmBooking  from './confirm/page'
import DispatchBooking  from './dispatch/page'
import IntransitBooking  from './intransit/page'
import DeliveredBooking  from './delivered/page'
import CancelledBooking  from './cancelled/page'




function page() {
  return (
    <div className="w-full min-h-[95vh] ">
       <Tabs defaultValue="Booking" className="relative w-full min-h-full ">
        <TabsList className=" flex justify-center flex-wrap rounded-2xl">
          <TabsTrigger value="Booking">
           New Booking
          </TabsTrigger>
          <TabsTrigger value="Pending">
          Pending Bookings
          </TabsTrigger>
          <TabsTrigger value="Confirm">
           Confirm Bookings
          </TabsTrigger>
          <TabsTrigger value="Intilize">
           Intilize Bookings
          </TabsTrigger>
          <TabsTrigger value="Dispatch">
           Dispatch Bookings
          </TabsTrigger>
          <TabsTrigger value="intransist">
           In-Transist Bookings
          </TabsTrigger>
          <TabsTrigger value="Delivered">
           Delivered Bookings
          </TabsTrigger>
          <TabsTrigger value="Cancelled">
           Cancelled Bookings
          </TabsTrigger>
        
        </TabsList>
       
        <TabsContent value="Booking">
        <NewBooking  />
          </TabsContent>
          <TabsContent value="Pending">
          <PendingBooking />
          </TabsContent>
          <TabsContent value="Confirm">
          <ConfirmBooking />
          </TabsContent>
          <TabsContent value="Intilize">
          <IntilizeBooking />
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
  )
}

export default page











