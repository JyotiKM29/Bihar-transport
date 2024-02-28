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
    const response = await fetch(`/api/accounting/getOneReceipt/${id}`);
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
          Money Receipt Details :
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
            <DataView
              label="Reciept Date"
              value={
                data?.recieptDate
                  ? new Date(data?.recieptDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "N/A"
              }
              show={editAccounting}
              tableId={data?._id}
              apiCall="updateReceipt"
              identifier={`recieptDate`}
              type="date"
            />

            <hr />

            <DataView
              label="Reciept No"
              value={data?.recieptNo}
              show={editAccounting}
              tableId={data?._id}
              apiCall="updateReceipt"
              identifier={`recieptNo`}
            />
            <hr />

            <DataView
              label="Received From"
              value={data?.receivedFrom}
              // show={editAccounting}
              tableId={data?._id}
              apiCall="updateReceipt"
              identifier={`receivedFrom`}
            />
            <hr />
            <DataView
              label="Received Amount"
              value={data?.receivedAmount}
              show={editAccounting}
              tableId={data?._id}
              apiCall="updateReceipt"
              identifier={`receivedAmount`}
            />
            <hr />
            <DataView
              label="TDS"
              value={data?.TDS}
              show={editAccounting}
              tableId={data?._id}
              apiCall="updateReceipt"
              identifier={`TDS`}
            />
            <hr />
            <DataView
              label="Discount"
              value={data?.discount}
              show={editAccounting}
              tableId={data?._id}
              apiCall="updateReceipt"
              identifier={`discount`}
            />
            <hr />
            <DataView
              label="Paid By"
              value={data?.paidBy}
              show={editAccounting}
              tableId={data?._id}
              apiCall="updateReceipt"
              identifier={`paidBy`}
            />
            <hr />
            <DataView
              label="Narration"
              value={data?.narration}
              show={editAccounting}
              tableId={data?._id}
              apiCall="updateReceipt"
              identifier={`narration`}
            />
            <hr />
          </>
        )}
      </>
    </div>
  );
};

export default View;
