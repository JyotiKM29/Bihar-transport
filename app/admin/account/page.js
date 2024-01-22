import React from 'react'
import Account from './Account'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";

const page = () => {
  return (
    <div className="w-full min-h-[95vh] ">
    <Tabs defaultValue="accounting" className="relative w-full min-h-full ">
     <TabsList className="absolute right-0">
       <TabsTrigger value="accounting">
       accounting
       </TabsTrigger>
       
     
     </TabsList>
     <TabsContent value="accounting">
       <Account />
     </TabsContent>
    
   
     </Tabs>
 </div>
  )
}

export default page
