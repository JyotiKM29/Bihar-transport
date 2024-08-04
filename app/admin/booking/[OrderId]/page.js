"use client";
import React, { useContext, useEffect, useState } from "react";
import { Input } from "../../../components/ui/input";
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
  const [newData, setNewData] = useState({ items: [] }); // Initialize as an object with an items array
  const [vehicleNo, setVehicleNo] = useState("");
  const [availableWgt, setAvailableWgt] = useState(0); // New state for available weight
  const [allotedWgt, setAllotedWgt] = useState(0);

  const userId = user?._id;

  useEffect(() => {
    console.log("Available Wgt: ", availableWgt, "alloted weight : ", allotedWgt);
  }, [availableWgt, allotedWgt]);

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
          `/api/accounting/getLedgerBalance/${ledgerId}`,
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

        const itemsList = Array.isArray(result.booking.itemsList.item)
          ? result.booking.itemsList.item
          : [];
        setNewData({ items: itemsList }); // Correctly set the items array
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
    console.log("Type of newData: ", typeof newData);
    console.log("Value of newData: ", newData);
  }, [newData]);

  useEffect(() => {
    if (allotedWgt > 0) {
      const updatedData = distributeWeight(newData.items, allotedWgt);
      setNewData({ items: updatedData });
    }
  }, [allotedWgt]);

  const distributeWeight = (items, weight) => {
    let remainingWeight = weight;

    return items.map(item => {
      const availableWeight = item.actualWeight * (item.actualWeightUnit === "TON" ? 1000 : 1);
      const allocatedWeight = Math.min(availableWeight, remainingWeight);
      remainingWeight -= allocatedWeight;
      return {
        ...item,
        allocatedWeight: allocatedWeight / (item.actualWeightUnit === "TON" ? 1000 : 1)
      };
    });
  };

  const filterData =
    vehicleData && vehicleData.data && Array.isArray(vehicleData.data)
      ? vehicleData.data.filter((vehicle) =>
          vehicle.vehicleNo.toLowerCase().includes(vehicleNo.toLowerCase()),
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
        <table className="min-w-full divide-y divide-gray-200 rounded-lg border">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Vehicle No</th>
              <th className="px-4 py-2 text-left font-medium">Driver Name</th>
              <th className="px-4 py-2 text-left font-medium">Vehicle Type</th>
              <th className="px-4 py-2 text-left font-medium">Capacity</th>
              <th className="px-4 py-2 text-left font-medium">
                Available Space
              </th>
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
          <h3 className="p-1 text-2xl font-bold text-blue-700">
            Product Details:
          </h3>
          <table className="mt-4 min-w-full divide-y divide-gray-200 rounded-lg border">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium">
                  Product Name
                </th>
                <th className="px-4 py-2 text-left font-medium">Weight</th>
                <th className="px-4 py-2 text-left font-medium">
                  Allotted Weight
                </th>
                
              </tr>
            </thead>
            <tbody>
              {newData.items.length > 0 ? (
                newData.items.map((item) => (
                  <tr key={item._id} className="border-t">
                    <td className="whitespace-nowrap px-4 py-2">
                      {item.material}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2">
                      {item.actualWeight} {item.actualWeightUnit}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2">
                      {item.allocatedWeight || 0} {item.actualWeightUnit}
                    </td>
                    
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="whitespace-nowrap px-4 py-2 text-center"
                  >
                    No products available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AllocateVehicle
        vehicleData={vehicleData}
        ledgerBalance={ledgerBalance}
        allotedWgt={allotedWgt}
        availableWgt={availableWgt}
        setAllotedWgt={setAllotedWgt}
        setAvailableWgt={setAvailableWgt}
        params={params}
      />
    </div>
  );
};

export default Allocation;
