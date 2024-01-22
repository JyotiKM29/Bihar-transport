import React from 'react'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";

import Registration from './registration/page';
import Allocation from './allocation/page';


function Vehicle() {
  return (
    <div className="w-full min-h-[95vh] ">
       <Tabs defaultValue="registration" className="relative w-full min-h-full ">
        <TabsList className="absolute right-0">
          <TabsTrigger value="registration">
          Registration
          </TabsTrigger>
          <TabsTrigger value="allocation">
          Vehicle Allocation
          </TabsTrigger>
         
        
        </TabsList>
        <TabsContent value="registration">
         <Registration />
        </TabsContent>
        <TabsContent value="allocation">
        <Allocation />
        </TabsContent>
       
      
        </Tabs>
    </div>
  )
}

export default Vehicle












