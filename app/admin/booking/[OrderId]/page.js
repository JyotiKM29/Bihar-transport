"use client";
import React, { useContext, useEffect, useState } from "react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { UserContext } from "../../../context/UserContextProvider";
import { useToast } from "../../../components/ui/use-toast";
import AllocateVehicle from "./AllocateVehicle";
import Link from "next/link";

const Allocation = ({ params }) => {
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useContext(UserContext);
  const [vehicleData, setVehicleData] = useState([]);
  const [ledgerBalance, setLedgerBalance] = useState(0);
  const [newData, setNewData] = useState([]); // Initialize as an empty array
  const [vehicleNo, setVehicleNo] = useState("");
  const userId = user?._id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userId) {
          const response = await fetch(`/api/vehicledata/${userId}`, {
            method: "GET",
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          setVehicleData(data);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error:", error);
      }
    };

    const fetchLedgerData = async () => {
      try {
        const ledgerId = params.OrderId;

        const response = await fetch(
          `/api/accounting/getLedgerBalance/${ledgerId}`
        );
        if (response.ok) {
          const data = await response.json();
          setLedgerBalance(data.balance);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error: ", error);
      }
    };

    const fetchBookingData = async () => {
      try {
        const orderNo = params.OrderId;

        const response = await fetch(`/api/bookingDetail/${orderNo}`, {
          method: "GET",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        console.log("Booking Data: ", result); // Debug: log the entire response

        const itemsList = Array.isArray(result.booking.itemsList.items)
          ? result.booking.itemsList
          : [];
        setNewData(itemsList); // Correctly set the items array



        setNewData(result.booking.itemsList); // Correctly set the items array
      } catch (error) {
        setLoading(false);
        console.error("Error: ", error);
      }
    };

    if (userId) {
      fetchLedgerData();
      fetchData();
      fetchBookingData();
    }
  }, [userId, params.OrderId]);

  useEffect(() => {
    console.log("Booking Data items updated: ", newData);
  }, [newData]);

  const filterData =
    vehicleData && vehicleData.data && Array.isArray(vehicleData.data)
      ? vehicleData.data.filter((vehicle) =>
          vehicle.vehicleNo.toLowerCase().includes(vehicleNo.toLowerCase())
        )
      : [];

  const vehicleDataSlice = filterData.slice(0, 4);

  return (
    <div className="h-fit w-full overflow-hidden rounded-3xl bg-white px-6 py-4 shadow-sm">
      <h2 className="p-1 text-4xl font-bold text-blue-700">
        Vehicle Allocation:
      </h2>
      <div className="mt-6 flex h-full w-full flex-col">
        <div className="mb-8 flex w-full items-center justify-between self-end rounded-xl border px-6 py-4 shadow-md">
          <label className="flex items-center justify-start gap-4 text-nowrap">
            Order No: <h2 className="font-semibold">{params.OrderId}</h2>
          </label>
          <div className="flex items-center gap-3">
            <label className="flex items-center justify-start gap-4 text-nowrap">
              Search by Vehicle No:
              <Input
                className="w-[20rem]"
                type="text"
                placeholder="Enter Vehicle No"
                value={vehicleNo}
                onChange={(e) => setVehicleNo(e.target.value)}
              />
            </label>

            <Link
              href="/admin/vehicle"
              className="w-fit self-center text-nowrap rounded bg-blue-600 px-4 py-2 text-white"
              type="submit"
            >
              Add New Vehicle
            </Link>
          </div>
        </div>

        {/* data table */}
        <table className="rounded-lg min-w-full divide-y divide-gray-200 border">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Vehicle No</th>
              <th className="px-4 py-2 text-left font-medium">Driver Name</th>
              <th className="px-4 py-2 text-left font-medium">Vehicle Type</th>
              <th className="px-4 py-2 text-left font-medium">Capacity</th>
              <th className="px-4 py-2 text-left font-medium">Available Space</th>
              <th className="px-4 py-2 text-left font-medium">Vehicle Age</th>
              <th className="px-4 py-2 text-left font-medium">Allocation</th>
              <th className="px-4 py-2 text-left font-medium">Owner Name</th>
            </tr>
          </thead>
          <tbody>
            {vehicleDataSlice.map((data) => (
              <tr key={data._id} className="border-t">
                <td className="whitespace-nowrap px-4 py-2">
                  {data.vehicleNo}
                </td>
                <td className="whitespace-nowrap px-4 py-2">
                  {data.driver.name}
                </td>
                <td className="whitespace-nowrap px-4 py-2">
                  {data.vehicleType}
                </td>
                <td className="whitespace-nowrap px-4 py-2">
                  {data.maxCapacity} ton
                </td>
                <td className="whitespace-nowrap px-4 py-2">
                  {data.maxCapacity * 100 - data.filledWeight} kg
                </td>
                <td className="whitespace-nowrap px-4 py-2">
                  {data.vehicleAge}
                </td>
                <td className="whitespace-nowrap px-4 py-2">
                  {data.allotmentStatus ? "Booked" : "UnBooked"}
                </td>
                <td className="whitespace-nowrap px-4 py-2">
                  {data.owner.name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* products table */}
        <div className="mt-6">
          <h3 className="p-1 text-2xl font-bold text-blue-700">Product Details:</h3>
          <table className="rounded-lg min-w-full divide-y divide-gray-200 border mt-4">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Product Name</th>
                <th className="px-4 py-2 text-left font-medium">Weight</th>
              </tr>
            </thead>
            <tbody>
  {newData?.item?.map((item) => (
    <tr key={item._id} className="border-t">
      <td className="whitespace-nowrap px-4 py-2">{item.material}</td>
      <td className="whitespace-nowrap px-4 py-2">
        {item.actualWeight} {item.actualWeightUnit}
      </td>
    </tr>
  ))}

  <tr className="border-t">
    <td className="whitespace-nowrap px-4 py-2 font-bold">Total Not alloted from this Booking</td>
    <td className="whitespace-nowrap px-4 py-2 font-bold">
      {newData.totalActualWeight} kg 
    </td>
  </tr>
</tbody>

          </table>
        </div>

        <AllocateVehicle params={params} ledgerBalance={ledgerBalance} />
      </div>
    </div>
  );
};

export default Allocation;
