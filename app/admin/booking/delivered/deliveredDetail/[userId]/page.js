"use client";
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "../../../../components/ui/form";
  import * as z from "zod";
  import { Input } from "../../../../components/ui/input";
  import { useState, useEffect, useContext } from "react";
  import { useToast } from "../../components/ui/use-toast";
  import Link from "next/link";
  import { FiPlus } from "react-icons/fi";
  import { useRouter } from "next/navigation";
  import AdditionalChargers from "./AdditionalCharge";
  import { UserContext } from "../../context/UserContextProvider";


  const formSchema = z.object({
    CN : z.string(),
    consignor: z.string(),
    consignee: z.string(),
    paymentLiability: z.string(),
    totalBillingAmmount:z.coerce.number(),
    AmountReceived:z.coerce.number(),
  })

const DeliveryForm = () => {
  return (
    <div>DeliveryForm</div>
  )
}

export default DeliveryForm