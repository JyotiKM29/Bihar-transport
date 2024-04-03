"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { useRouter } from "next/navigation";

import { IoIosArrowBack } from "react-icons/io";
import { MdEdit } from "react-icons/md";


const page = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const router = useRouter();
  const [editAccounting, setEditAccounting] = useState(false);


  const handleGoBack = () => {
    router.back();
  };
  return (
    <div className="min-h-[90vh] w-full rounded-2xl  bg-white p-8  shadow-sm "> 
        

        <div className="flex items-center justify-between">
        <h2 className=" text-3xl font-semibold text-cyan-800 ">
    Quotations  Details :
        </h2>
        <div className="flex items-center justify-between space-x-2">
          <Button className="space-x-2 px-4 bg-cyan-700 hover:bg-cyan-800" onClick={handleGoBack}>
            <IoIosArrowBack className=" fill-white" />
            <pre className="text-base">Back</pre>
          </Button>
          <Button
            onClick={() => setEditAccounting(!editAccounting)}
            className="space-x-2 px-4 bg-cyan-700 hover:bg-cyan-800"
          >
            <pre className="text-base">Edit</pre>
            <MdEdit className="h-8 fill-white" />
          </Button>
        </div>
      </div>


    </div>
  )
}

export default page
