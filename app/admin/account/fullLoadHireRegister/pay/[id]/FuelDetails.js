import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "@/app/context/UserContextProvider";
import { useToast } from "@/app/components/ui/use-toast";
import { useRouter } from "next/navigation";

import { IoIosArrowBack } from "react-icons/io";
import { Input } from "@/app/components/ui/input";

const FuelDetails = ({ data }) => {
  const [paymentMode, setPaymentMode] = useState("");
  const [date, setDate] = useState("");
  const [amountPaid, setAmountPaid] = useState(0);
  const [fine, setFine] = useState(0);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [finalDue, setFinalDue] = useState(0);
  const { user } = useContext(UserContext);
  const { toast } = useToast();

  const adminId = user?._id;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const paymentDetails = {
        paymentMode,
        date,
        amountPaid,
        fine,
        finalDue,
        remarks,
        bookingId: data.bookings._id,
      };

      const value = {
        paymentDetails,
        adminId,
        bookingId: data.bookings._id,
        vehicleId: data.vehicle._id,
      };

      console.log(value);

      const response = await fetch("/api/accounting/fullLoadHireRegister/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      });

      setLoading(false);
      const result = await response.json();

      if (response.ok) {
        displayToast("Given money for petrol", "✅");
      } else {
        displayToast(
          "Try again later, there's some error",
          "❌",
          result.message,
        );
      }
    } catch (error) {
      setLoading(false);
      displayToast("Try again later, there's some error", "❌", error.message);
    }
  };

  const displayToast = (title, action, description = "") => {
    toast({
      title,
      action,
      description,
    });
  };

  const handleToggleForm = () => {
    setShowForm(!showForm);
  };

  const expenseData = data.vehicle.expanse.fuel;
  const paymentData = data.vehicle.bookedBy[0].payment; // Assuming expense data is passed in `data.expenses`

  const calculateFinalDues = (pendingAmount, fine, amountPaid) => {
    return Number(pendingAmount) + Number(fine) - Number(amountPaid);
  };

  const pendingAmount = data.vehicle?.bookedBy[0]?.balanceAmount || 0;

  useEffect(() => {
    console.log("amount paid: ", amountPaid);
    console.log("fine paid: ", fine);
    console.log("pending amount : ", pendingAmount);
    console.log("finalDue:", finalDue);

    setFinalDue(calculateFinalDues(pendingAmount, fine, amountPaid));
    console.log("finalDue", finalDue);
  }, [pendingAmount, fine, amountPaid]);

  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-[90vh] rounded-xl bg-white  px-8 py-8 shadow-xl">
      <div className=" flex w-full justify-between">
        <div>
          {showForm ? (
            ""
          ) : (
            <button
              onClick={handleGoBack}
              className=" mb-4 flex items-center gap-3 rounded-md bg-indigo-700 px-4 py-2  text-white shadow-md hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
            >
              <IoIosArrowBack className=" fill-white" />
              back
            </button>
          )}
        </div>
        <button
          onClick={handleToggleForm}
          className=" mb-4 rounded-md bg-indigo-700 px-4 py-2  text-white shadow-md hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
        >
          {showForm ? (
            <p className="flex items-center gap-3">
              <IoIosArrowBack className=" fill-white" />
              Back
            </p>
          ) : (
            "Give Payment"
          )}
        </button>
      </div>

      {!showForm ? (
        <div>
          <h2 className="mb-4 text-center text-2xl font-bold text-indigo-900  underline">
            Fuel Payments Other
          </h2>
          <div className="overflow-x-auto md:overflow-x-visible">
            <table className="min-w-full border  border-gray-300 bg-white">
              <thead>
                <tr className=" w-full border border-indigo-600 bg-indigo-300 text-indigo-900">
                  <th className=" text-nowrap border border-indigo-600 p-2 pr-3 text-sm font-medium text-indigo-900  md:text-base  ">
                    Date
                  </th>
                  <th className=" text-nowrap border border-indigo-600 p-2 pr-3 text-sm font-medium text-indigo-900  md:text-base  ">
                    Fuel Type
                  </th>
                  <th className=" text-nowrap border border-indigo-600 p-2 pr-3 text-sm font-medium text-indigo-900  md:text-base  ">
                    Volume
                  </th>
                  <th className=" text-nowrap border border-indigo-600 p-2 pr-3 text-sm font-medium text-indigo-900  md:text-base  ">
                    Rate
                  </th>
                  <th className=" text-nowrap border border-indigo-600 p-2 pr-3 text-sm font-medium text-indigo-900  md:text-base  ">
                    Total Cost
                  </th>
                </tr>
              </thead>
              <tbody>
                {expenseData.map((expense, index) => (
                  <tr className="w-full text-center" key={index}>
                    <td className="border border-indigo-900 p-2 text-indigo-900">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="border border-indigo-900 p-2 text-indigo-900">
                      {expense.fuelType}
                    </td>
                    <td className="border border-indigo-900 p-2 text-indigo-900">
                      {expense.fuelVolume}
                    </td>
                    <td className="border border-indigo-900 p-2 text-indigo-900">
                      {expense.fuelRate}
                    </td>
                    <td className="border border-indigo-900 p-2 text-indigo-900">
                      {expense.fuelVolume * expense.fuelRate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <br />
          <br />
          <br />
          <br />

          <h2 className="mb-4 text-center text-2xl font-bold text-indigo-900  underline">
            Other Payment History
          </h2>
          <div className="overflow-x-auto md:overflow-x-visible">
            <table className="min-w-full border border-gray-300 bg-white">
              <thead>
                <tr className=" w-full border border-indigo-600 bg-indigo-300 text-indigo-900">
                  <th className=" text-nowrap border border-indigo-600 p-2 pr-3 text-sm font-medium text-indigo-900  md:text-base  ">
                    Date
                  </th>
                  <th className=" text-nowrap border border-indigo-600 p-2 pr-3 text-sm font-medium text-indigo-900  md:text-base  ">
                    Amount Paid
                  </th>
                  <th className=" text-nowrap border border-indigo-600 p-2 pr-3 text-sm font-medium text-indigo-900  md:text-base  ">
                    final Due
                  </th>
                  <th className=" text-nowrap border border-indigo-600 p-2 pr-3 text-sm font-medium text-indigo-900  md:text-base  ">
                    Fine
                  </th>
                  <th className=" text-nowrap border border-indigo-600 p-2 pr-3 text-sm font-medium text-indigo-900  md:text-base  ">
                    payment mode{" "}
                  </th>
                  <th className=" text-nowrap border border-indigo-600 p-2 pr-3 text-sm font-medium text-indigo-900  md:text-base  ">
                    Remarks{" "}
                  </th>
                </tr>
              </thead>
              <tbody>
                {paymentData.map((payment, index) => (
                  <tr className="w-full text-center" key={index}>
                    <td className="border border-indigo-900 p-2 text-indigo-900">
                      {new Date(payment.date).toLocaleDateString()}
                    </td>
                    <td className="border border-indigo-900 p-2 text-indigo-900">
                      {payment.amountPaid}
                    </td>
                    <td className="border border-indigo-900 p-2 text-indigo-900">
                      {payment.finalDue}
                    </td>
                    <td className="border border-indigo-900 p-2 text-indigo-900">
                      {payment.fine}
                    </td>
                    <td className="border border-indigo-900 p-2 text-indigo-900">
                      {payment.paymentMode}
                    </td>
                    <td className="border border-indigo-900 p-2 text-indigo-900">
                      {payment.remarks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="mb-4 text-center text-2xl font-bold text-indigo-900  underline">
            Booking Details
          </h2>
          <div className="mb-8 rounded-2xl bg-indigo-100 p-6 shadow-xl">
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2  xl:grid-cols-3 ">
              <p>
                <strong>Vehicle Hire NO:</strong> {data.bookings.orderNumber}
              </p>
              <p>
                <strong>Vehicle No: </strong> {data.vehicle.vehicleNo}
              </p>
              <p>
                <strong>Shipping Charge:</strong>{" "}
                {data.vehicle.bookedBy[0].netBhara}
              </p>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2  xl:grid-cols-3">
              <p>
                <strong>Owner Name Number:</strong> {data.vehicle?.owner?.name}
              </p>
              <p>
                <strong>Driver Name:</strong> {data.vehicle?.driver?.name}
              </p>
              <p>
                <strong>Paid Amount:</strong>{" "}
                {data.vehicle?.bookedBy[0].totalPaidAmount || 0}
              </p>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2  xl:grid-cols-3">
              <p>
                <strong>Hire Date:</strong>{" "}
                {new Date(data.bookings.date).toLocaleDateString()}
              </p>
              <p></p>
              <p>
                <strong>Pending Amount:</strong> {pendingAmount}
              </p>
            </div>
          </div>
          <h2 className="mb-4 text-center text-2xl font-bold text-indigo-900  underline">
            Fuel Details
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2  xl:grid-cols-3">
              <label className="block">
                <span className="font-semibold text-gray-700 ">
                  Payment Mode{" "}
                </span>
                <Input
                  type="text"
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </label>
              <label className="block">
                <span className="font-semibold text-gray-700 ">
                  Payment Date
                </span>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </label>
              <label className="block">
                <span className="font-semibold text-gray-700 ">Fine</span>
                <Input
                  type="number"
                  value={fine}
                  onChange={(e) => setFine(Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </label>
              <label className="block">
                <span className="font-semibold text-gray-700 ">
                  Amount Paid
                </span>
                <Input
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </label>

              <label className="block">
                <span className="font-semibold text-gray-700 ">Final Dues</span>
                <Input
                  type="number"
                  value={finalDue}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </label>

              <label className="block">
                <span className="font-semibold text-gray-700 ">Remarks</span>
                <Input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </label>
            </div>
            <div className="flex justify-center pt-8">
              <button
                type="submit"
                className="w-1/3 rounded-md  bg-indigo-600 px-4 py-2 font-semibold text-white shadow-md hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-75"
              >
                {loading ? "Adding..." : "Save Fuel Payment"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default FuelDetails;
