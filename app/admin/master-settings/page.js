'use client'
import React, { useContext } from 'react'
import UserTable from './UserTable'
import AdminTable from './AdminTable'
import OwnerTable from './OwnerTable'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { UserContext } from '../../context/UserContextProvider';

const MasterSetting = () => {
  const { user} = useContext(UserContext);
  console.log(user)

  if(!user?.isOwner ){
    return <div className="h-full w-full ">
     <h1 className='text-2xl font-semiBold'>
       Your are not Allowed , ask Owner 
     </h1> 
    </div>
  }

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

export default MasterSetting
