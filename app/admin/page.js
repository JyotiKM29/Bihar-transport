import React from "react";
import TodayData from './component/TodayData';
import WeekData from './component/WeekData';
import MonthData from './component/MonthData';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

function Admin() {
  // const shouldRenderChart = typeof window !== 'undefined'; // Check if window is defined

  return (
    <div className="w-full min-h-[95vh] ">
   
      <Tabs defaultValue="Today" className="relative w-full min-h-full ">
        <TabsList className="absolute right-0">
          <TabsTrigger value="Month">Monthly</TabsTrigger>
          <TabsTrigger value="Week">Weeky</TabsTrigger>
          <TabsTrigger value="Today">Today</TabsTrigger>
        </TabsList>
        <TabsContent value="Today">
          <TodayData />
        </TabsContent>
        <TabsContent value="Week">
          <WeekData />
        </TabsContent>
        <TabsContent value="Month">
          <MonthData />
        </TabsContent>
      </Tabs>

     

      
    </div>
  );
}

export default Admin;


