"use client";

import React, { useState, useEffect, useContext } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";
import LedgerRegistration from "./leadgerDetails/page"
import MoneyReceipt from './moneyreceipt/MoneyReceipt';
import Invoices from './invoice/Invoices';
import MoneyTransfer from './moneytransfer/MoneyTransfer';
import PaymentVoucher from './paymentVoucher/PaymentVoucher';
import MoneyExpenses from './moneyExpense/MoneyExpenses';
import JournalEntries from './journalEntries/JournalEntries';
import BulkReceive from './bulkReceive/BulkReceive';
import BulkPayment from './bulkPayment/BulkPayment';
import PendingPayment from './pendingPayment/PendingPayment';
import HireRegister from './fullLoadHireRegister/HireRegister';
import { UserContext } from '@/app/context/UserContextProvider';

const Page = () => {
  const [selectedTab, setSelectedTab] = useState(null);
  const router = useRouter();
  const user = useContext(UserContext);  


  const searchParams = useSearchParams();
  let tabValue = searchParams.get("tab");
  if (!tabValue) tabValue = "newLedger";


  useEffect(() => {
    setSelectedTab(tabValue);
  }, [tabValue]);

  const handleTabChange = (value) => {
    setSelectedTab(value);
    router.push(`/admin/account?tab=${value}`);
  };

   if (!user?.user?.isOwner) {
     return (
       <div className="h-full w-full ">
         <h1 className="font-semiBold text-2xl">
           Your are not Allowed , ask Owner
         </h1>
       </div>
     );
   };

  return (
    <div className="min-h-[95vh] w-full">
      <Tabs value={selectedTab} className="relative min-h-full w-full">
        <TabsList className="flex flex-wrap justify-center rounded-2xl">
          <TabsTrigger
            value="newLedger"
            onClick={() => handleTabChange("newLedger")}
          >
            New Ledger
          </TabsTrigger>
          <TabsTrigger
            value="moneyReceipt"
            onClick={() => handleTabChange("moneyReceipt")}
          >
            Money Receipt
          </TabsTrigger>
          <TabsTrigger
            value="invoices"
            onClick={() => handleTabChange("invoices")}
          >
            Invoices
          </TabsTrigger>
          <TabsTrigger
            value="moneyTransfer"
            onClick={() => handleTabChange("moneyTransfer")}
          >
            Money Transfer
          </TabsTrigger>
          <TabsTrigger
            value="pendingPayment"
            onClick={() => handleTabChange("pendingPayment")}
          >
            Pending Payment
          </TabsTrigger>
          <TabsTrigger
            value="paymentVoucher"
            onClick={() => handleTabChange("paymentVoucher")}
          >
            Payment Voucher
          </TabsTrigger>
          <TabsTrigger
            value="manageExpense"
            onClick={() => handleTabChange("manageExpense")}
          >
            Manage Expense
          </TabsTrigger>
          <TabsTrigger
            value="journalEntries"
            onClick={() => handleTabChange("journalEntries")}
          >
            Journal Entries
          </TabsTrigger>
          <TabsTrigger
            value="bulkReceive"
            onClick={() => handleTabChange("bulkReceive")}
          >
            Bulk Receive
          </TabsTrigger>
          <TabsTrigger
            value="bulkPayment"
            onClick={() => handleTabChange("bulkPayment")}
          >
            Bulk Payment
          </TabsTrigger>
          <TabsTrigger
            value="hireRegister"
            onClick={() => handleTabChange("hireRegister")}
          >
           Full Load Hire Register
          </TabsTrigger>
        </TabsList>

        <TabsContent value="newLedger">
          <LedgerRegistration />
        </TabsContent>
        <TabsContent value="moneyReceipt">
          <MoneyReceipt />
        </TabsContent>
        <TabsContent value="invoices">
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
        <TabsContent value="bulkReceive">
          <BulkReceive />
        </TabsContent>
        <TabsContent value="bulkPayment">
          <BulkPayment />
        </TabsContent>
        <TabsContent value="hireRegister">
          <HireRegister />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
