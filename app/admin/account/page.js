import React from 'react'

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import LedgerRegistration from './LedgerRegistration'

const page = () => {
  return (
    <div className="w-full min-h-[95vh] ">
    <Tabs defaultValue="newLedger" className="relative w-full min-h-full ">
     <TabsList className=" flex justify-center flex-wrap rounded-2xl">
       <TabsTrigger value="newLedger">
       New ledger
       </TabsTrigger>
       <TabsTrigger value="moneyReceipt">
       Money receipt
       </TabsTrigger>
       <TabsTrigger value="Invoices">
       Invoices

       </TabsTrigger>
       <TabsTrigger value="moneyTransfer ">
       Money transfer 

       </TabsTrigger>
       <TabsTrigger value=" pendingPayment">
       Pending payment

       </TabsTrigger>
       <TabsTrigger value="paymentVoucher">
       Payment Voucher

       </TabsTrigger>
       <TabsTrigger value="  manageExpense">
       Manage Expense

       </TabsTrigger>
       <TabsTrigger value="journalEntries">
       Journal Entries

       </TabsTrigger>
       <TabsTrigger value=" bulkRecieve">
       Bulk Recieve

       </TabsTrigger>
       <TabsTrigger value=" bulkPayment">
       Bulk Payment

       </TabsTrigger>
     
     </TabsList>
    
     <TabsContent value="newLedger">
     
     <LedgerRegistration />
       </TabsContent>
       <TabsContent value="  Money receipt">
      
       </TabsContent>
       <TabsContent value="Invoices">
      
       </TabsContent>
       <TabsContent value="moneyTransfer">
     
       </TabsContent>
       <TabsContent value=" pendingPayment">
      
       </TabsContent>
       <TabsContent value="paymentVoucher">
      
       </TabsContent>
       <TabsContent value="  manageExpense">
      
       </TabsContent>
       <TabsContent value="journalEntries">
        
        </TabsContent>
       <TabsContent value=" bulkRecieve">
        
       </TabsContent>
       <TabsContent value=" bulkPayment">
        
       </TabsContent>
      
     
   
     </Tabs>
 </div>
  )
}

export default page




