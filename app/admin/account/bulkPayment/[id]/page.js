"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../../../../components/ui/button";
import { useRouter } from "next/navigation";
import DataView from "../../DataView";
import { IoIosArrowBack } from "react-icons/io";
import { MdEdit } from "react-icons/md";

const View = ({ params }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const router = useRouter();
  const [editAccounting, setEditAccounting] = useState(false);

  const id = params.id;
  async function fetchData() {
    const response = await fetch(
      `/api/accounting/bulkPayment/getDetails/${id}`,
    );
    const result = await response.json();

    setData(result.data);
    setLoading(false);
    console.log("res", result);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="max-w max-h mt-14 rounded-2xl  bg-white px-4 py-4 shadow-lg md:px-10 lg:my-4 lg:p-8 lg:px-20">
      <div className="flex items-center justify-between">
        <h2 className="mb-8  text-3xl font-semibold text-orange-500">
          Bulk Payment Details :
        </h2>
        <div className="flex items-center justify-between space-x-2">
          <Button className="space-x-2 px-4" onClick={handleGoBack}>
            <IoIosArrowBack className=" fill-white" />
            <pre className="text-base">Back</pre>
          </Button>
          <Button
            onClick={() => setEditAccounting(!editAccounting)}
            className="space-x-2 px-4"
          >
            <pre className="text-base">Edit</pre>
            <MdEdit className="h-8 fill-white" />
          </Button>
        </div>
      </div>

      <>
        {loading ? (
          "loading ..."
        ) : (
          <>
            <DataView label="Receive From" value={data?.recieveFrom} />
            <hr />

            <DataView
              label="Receive Amount"
              value={data?.recieveAmount}
              show={editAccounting}
              tableId={data?._id}
              apiCall="bulkPayment"
              identifier={`recieveAmount`}
            />
            <hr />

            <DataView label="Payment Mode" value={data?.paymentMode}
            show={editAccounting}
              tableId={data?._id}
              apiCall="bulkPayment"
              identifier={`paymentMode`}
               />
            <hr />
           
            <DataView label="Remark" value={data?.remarks} 
              show={editAccounting}
              tableId={data?._id}
              apiCall="bulkPayment"
              identifier={`remarks`}
            />
            <hr />
           
            <DataView
              label="Date"
              value={
                data?.date
                  ? new Date(data?.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"
              }

              show={editAccounting}
              tableId={data?._id}
              apiCall="bulkPayment"
              identifier={`date`}
              type="date"
            />
            <hr />
          </>
        )}
      </>
    </div>
  );
};

export default View;
