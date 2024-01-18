import React from 'react'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import PersonalBooking  from './personal/page'
import CompanyBooking  from './company/page'
import GeneralBooking  from './general/page'



function page() {
  return (
    <div className="w-full min-h-[95vh] ">
       <Tabs defaultValue="personal" className="relative w-full min-h-full ">
        <TabsList className="absolute right-0">
          <TabsTrigger value="personal">
          Personal
          </TabsTrigger>
          <TabsTrigger value="general">
          General
          </TabsTrigger>
          <TabsTrigger value="company">
          Company
          </TabsTrigger>
        
        </TabsList>
        <TabsContent value="personal">
          <PersonalBooking  />
        </TabsContent>
        <TabsContent value="general">
        <GeneralBooking  />
        </TabsContent>
        <TabsContent value="company">
        <CompanyBooking  />
        </TabsContent>
      
        </Tabs>
    </div>
  )
}

export default page











