import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "@/app/context/UserContextProvider";
import { useToast } from "@/app/components/ui/use-toast";

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

  const expenseData = data.vehicle.expanse.fuel; // Assuming expense data is passed in `data.expenses`

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

  return (
    <div className="p-4">
      <button
        onClick={handleToggleForm}
        className="mb-4 rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
      >
        {showForm ? "Back" : "Add New Fuel"}
      </button>

      {!showForm ? (
        <div>
          <h2 className="mb-4 text-2xl font-bold">Fuel Payments Other</h2>
          <table className="min-w-full border border-gray-300 bg-white">
            <thead>
              <tr>
                <th className="border-b px-4 py-2">Date</th>
                <th className="border-b px-4 py-2">Fuel Type</th>
                <th className="border-b px-4 py-2">Volume</th>
                <th className="border-b px-4 py-2">Rate</th>
                <th className="border-b px-4 py-2">Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {expenseData.map((expense, index) => (
                <tr key={index}>
                  <td className="border-b px-4 py-2 text-center">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="border-b px-4 py-2 text-center">
                    {expense.fuelType}
                  </td>
                  <td className="border-b px-4 py-2 text-center">
                    {expense.fuelVolume}
                  </td>
                  <td className="border-b px-4 py-2 text-center">
                    {expense.fuelRate}
                  </td>
                  <td className="border-b px-4 py-2 text-center ">
                    {expense.fuelVolume * expense.fuelRate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <br />
          <br />
          <br />
          <br />

          <h2 className="mb-4 text-2xl font-bold">Other Payment History</h2>
          <table className="min-w-full border border-gray-300 bg-white">
            <thead>
              <tr>
                <th className="border-b px-4 py-2">Date</th>
                <th className="border-b px-4 py-2">Fuel Type</th>
                <th className="border-b px-4 py-2">Volume</th>
                <th className="border-b px-4 py-2">Rate</th>
                <th className="border-b px-4 py-2">Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {expenseData.map((expense, index) => (
                <tr key={index}>
                  <td className="border-b px-4 py-2 text-center">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="border-b px-4 py-2 text-center">
                    {expense.fuelType}
                  </td>
                  <td className="border-b px-4 py-2 text-center">
                    {expense.fuelVolume}
                  </td>
                  <td className="border-b px-4 py-2 text-center">
                    {expense.fuelRate}
                  </td>
                  <td className="border-b px-4 py-2 text-center ">
                    {expense.fuelVolume * expense.fuelRate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <h2 className="mb-4 text-2xl font-bold">Booking Details</h2>
          <div className="mb-4 grid grid-cols-3 gap-4">
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

          <div className="mb-4 grid grid-cols-3 gap-4">
            <p>
              <strong>Owner Name Number:</strong>{" "}
              {data.vehicle?.owner?.name}
            </p>
            <p>
              <strong>Driver Name:</strong> {data.vehicle?.driver?.name}
            </p>
            <p>
              <strong>Paid Amount:</strong>{" "}
              {data.vehicle?.bookedBy[0].totalPaidAmount || 0}
            </p>
          </div>

          <div className="mb-4 grid grid-cols-3 gap-4">
            <p>
              <strong>Hire Date:</strong>{" "}
              {new Date(data.bookings.date).toLocaleDateString()}
            </p>
            <p></p>
            <p>
              <strong>Pending Amount:</strong> {pendingAmount}
            </p>
          </div>

          <h2 className="mb-4 text-2xl font-bold">Fuel Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <label className="block">
                <span className="text-gray-700">Payment Mode </span>
                <input
                  type="text"
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Payment Date</span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Fine</span>
                <input
                  type="number"
                  value={fine}
                  onChange={(e) => setFine(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Amount Paid</span>
                <input
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </label>

              <label className="block">
                <span className="text-gray-700">Final Dues</span>
                <input
                  type="number"
                  value={finalDue}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </label>

              <label className="block">
                <span className="text-gray-700">Remarks</span>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </label>
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
            >
              {loading ? "Adding..." : "Save Fuel Payment"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default FuelDetails;
