import React from 'react'

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import LedgerRegistration from './leadgerDetails/page'
import MoneyReceipt from './moneyreceipt/MoneyReceipt'
import Invoices from './invoice/Invoices'
import MoneyTransfer from './moneytransfer/MoneyTransfer'
import PaymentVoucher from './paymentVoucher/PaymentVoucher'
import MoneyExpenses from './moneyExpense/MoneyExpenses'
import JournalEntries from './journalEntries/JournalEntries'
import BulkReceive from './bulkReceive/BulkReceive'
import BulkPayment from './bulkPayment/BulkPayment'
import PendingPayment from './pendingPayment/PendingPayment'

const page = () => {
  return (
    <div className="w-full min-h-[95vh] ">
    <Tabs defaultValue="manageExpense" className="relative w-full min-h-full ">
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
       <TabsTrigger value="moneyTransfer">
       Money transfer 

       </TabsTrigger>
       <TabsTrigger value="pendingPayment">
       Pending payment

       </TabsTrigger>
       <TabsTrigger value="paymentVoucher">
       Payment Voucher

       </TabsTrigger>
       <TabsTrigger value="manageExpense">
       Manage Expense

       </TabsTrigger>
       <TabsTrigger value="journalEntries">
       Journal Entries

       </TabsTrigger>
       <TabsTrigger value="bulkRecieve">
       Bulk Recieve

       </TabsTrigger>
       <TabsTrigger value="bulkPayment">
       Bulk Payment

       </TabsTrigger>
     
     </TabsList>
    
     <TabsContent value="newLedger">
     
     <LedgerRegistration />
       </TabsContent>
       <TabsContent value="moneyReceipt">
      <MoneyReceipt />
       </TabsContent>
       <TabsContent value="Invoices">
      <Invoices />
       </TabsContent>
       <TabsContent value="moneyTransfer">
     <MoneyTransfer />
       </TabsContent>
       <TabsContent value="pendingPayment">
     <PendingPayment />
       </TabsContent>
       <TabsContent value="paymentVoucher">
       <PaymentVoucher />
       </TabsContent>
       <TabsContent value="manageExpense">
      <MoneyExpenses />
       </TabsContent>
       <TabsContent value="journalEntries">
        <JournalEntries />
        </TabsContent>
       <TabsContent value="bulkRecieve">
        <BulkReceive />
       </TabsContent>
       <TabsContent value="bulkPayment">
        <BulkPayment />
       </TabsContent>
      
     
   
     </Tabs>
 </div>
  )
}

export default page




