import React from 'react'
import UserTable from './UserTable'
import AdminTable from './AdminTable'
import OwnerTable from './OwnerTable'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";

const page = () => {
  return (
    <div className="h-full w-full ">
   
  
  <Tabs defaultValue="userlist" className="relative w-full min-h-full ">
        <TabsList className="absolute right-0">
          <TabsTrigger value="ownerlist">Owner list</TabsTrigger>
          <TabsTrigger value="adminlist">Admin list</TabsTrigger>
          <TabsTrigger value="userlist">New Users</TabsTrigger>
           </TabsList>
        <TabsContent value="ownerlist">
       
        <OwnerTable />
        </TabsContent>
        <TabsContent value="adminlist">
       
        <AdminTable />
        </TabsContent>
        <TabsContent value="userlist">
        <UserTable />
        </TabsContent>
        
      </Tabs>


    </div>
  )
}

export default page
