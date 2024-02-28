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
    const response = await fetch(`/api/accounting/getOnePaymentVoucher/${id}`);
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
         Payment Voucher Details :
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
  label="paymentDate Date"
  value={
    data?.paymentDate
      ? new Date(data?.paymentDate).toLocaleDateString("en-US", {
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
  identifier={`paymentDate`}
  type="date"
/>

            <hr />

            <DataView
              label="paidAmount"
              value={data?.paidAmount}
              show={editAccounting}
              tableId={data?._id}
              apiCall="updateReceipt"
              identifier={`paidAmount`}
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
              label="paidBy"
              value={data?.paidBy}
              show={editAccounting}
              tableId={data?._id}
              apiCall="updateReceipt"
              identifier={`paidBy`}
            />
            <hr />
            <DataView
              label="narration"
              value={data?.narration}
              show={editAccounting}
              tableId={data?._id}
              apiCall="updateReceipt"
              identifier={`narration`}
            />
            <hr />
            <DataView
              label="voucherNo"
              value={data?.voucherNo}
              show={editAccounting}
              tableId={data?._id}
              apiCall="updateReceipt"
              identifier={`voucherNo`}
            />
            <hr />

            <h2 className="mt-6 text-2xl text-center text-blue-500 font-medium">Paid To</h2>
            <DataView
              label="vehicleNo"
              value={data?.paidTo.vehicleNo}
              show={editAccounting}
              tableId={data?._id}
              apiCall="updateReceipt"
              identifier={`paidTo.vehicleNo`}
            />
            <hr />
            <DataView
              label="ownerName"
              value={data?.paidTo.ownerName}
              show={editAccounting}
              tableId={data?._id}
              apiCall="updateReceipt"
              identifier={`paidTo.ownerName`}
            />
            <hr />
            <DataView
              label="driverName"
              value={data?.paidTo.driverName}
              show={editAccounting}
              tableId={data?._id}
              apiCall="updateReceipt"
              identifier={`paidTo.driverName`}
            />
            <hr />

            
          </>
        )}
      </>
    </div>
  );
};

export default View;
