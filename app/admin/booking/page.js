import React from 'react'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import NewBooking  from './newbooking/page'
import CompanyBooking  from './company/page'
import GeneralBooking  from './general/page'



function page() {
  return (
    <div className="w-full min-h-[95vh] ">
       <Tabs defaultValue="Booking" className="relative w-full min-h-full ">
        <TabsList className="absolute right-0">
          <TabsTrigger value="Booking">
           New Booking
          </TabsTrigger>
          <TabsTrigger value="Pending">
          Pending Booking
          </TabsTrigger>
          <TabsTrigger value="Confirm">
           Confirm Booking
          </TabsTrigger>
          <TabsTrigger value="Intilize">
           Intilize Booking
          </TabsTrigger>
          <TabsTrigger value="Dispatch">
           Dispatch Booking
          </TabsTrigger>
          <TabsTrigger value="Delivered">
           Delivered Booking
          </TabsTrigger>
          <TabsTrigger value="Cancelled">
           Cancelled Booking
          </TabsTrigger>
        
        </TabsList>
       
        <TabsContent value="Booking">
        <NewBooking  />
          </TabsContent>
          <TabsContent value="Pending">
          Pending Booking
          </TabsContent>
          <TabsContent value="Confirm">
           Confirm Booking
          </TabsContent>
          <TabsContent value="Intilize">
           Intilize Booking
          </TabsContent>
          <TabsContent value="Dispatch">
           Dispatch Booking
          </TabsContent>
          <TabsContent value="Delivered">
           Delivered Booking
          </TabsContent>
          <TabsContent value="Cancelled">
           Cancelled Booking
          </TabsContent>
        
      
        </Tabs>
    </div>
  )
}

export default page











