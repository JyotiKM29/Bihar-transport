import React, { useContext, useState } from 'react';
import { UserContext } from '@/app/context/UserContextProvider';
import { useToast } from '@/app/components/ui/use-toast';

const FuelDetails = ({ data }) => {
  const [fuelType, setFuelType] = useState('');
  const [date, setDate] = useState('');
  const [slipCouponNo, setSlipCouponNo] = useState('');
  const [petrolPump, setPetrolPump] = useState('');
  const [fuelVolume, setFuelVolume] = useState('');
  const [fuelRate, setFuelRate] = useState('');
  const [cashReceived, setCashReceived] = useState('');
  const [paymentTerm, setPaymentTerm] = useState('');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { user } = useContext(UserContext);
  const { toast } = useToast();

  const adminId = user?._id;

  // console.log(data);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fuelDetails = {
      fuelType,
      date,
      slipCouponNo,
      petrolPump,
      fuelVolume: parseFloat(fuelVolume),
      fuelRate: parseFloat(fuelRate),
      cashReceived: parseFloat(cashReceived),
      paymentTerm,
      remarks,
      bookingId: data.bookings_id,
    };

    const value = {
      fuelDetails,
      adminId,
      bookingId: data.bookings._id,
      vehicleId: data.vehicle._id,
    };

    console.log(value);

    const response = await fetch("/api/accounting/fullLoadHireRegister/giveFuel", {
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
      displayToast("Try again later, there's some error", "❌", result.message);
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
          <h2 className="mb-4 text-2xl font-bold">Expense Data</h2>
          <table className="min-w-full border border-gray-300 bg-white">
            <thead>
              <tr>
                <th className="border-b px-4 py-2">Date</th>
                <th className="border-b px-4 py-2">Coupon No</th>
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
                    {expense?.slipCouponNo}
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
                  <td className="border-b px-4 py-2 text-center">
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
              <strong>Vehicle Hire NO:</strong> {data.bookingsorderNumber}
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
              <strong>Owner Name Number:</strong> {data.vehicle?.owner?.name}
            </p>
            <p>
              <strong>Driver Name:</strong> {data.vehicle?.driver?.name}
            </p>
            <p>
              <strong>Advance Amount:</strong>{" "}
              {data.vehicle?.bookedBy[0]?.advanceAmount
                ? data.vehicle?.bookedBy[0]?.advanceAmount
                : 0}
            </p>
          </div>

          <div className="mb-4 grid grid-cols-3 gap-4">
            <p>
              <strong>Hire Date:</strong>{" "}
              {new Date(data.bookingsdate).toLocaleDateString()}
            </p>
            <p>
              <strong>Hire Due:</strong>{" "}
              {data.vehicle?.bookedBy[0]?.balanceAmount}
            </p>
            <p>
              <strong>Hire Due:</strong>{" "}
              {data.vehicle?.bookedBy[0]?.balanceAmount}
            </p>
          </div>

          <h2 className="mb-4 text-2xl font-bold">Fuel Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <label className="block">
                <span className="text-gray-700">Fuel Type</span>
                <input
                  type="text"
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Date</span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Slip/Coupon No</span>
                <input
                  type="text"
                  value={slipCouponNo}
                  onChange={(e) => setSlipCouponNo(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Petrol Pump</span>
                <input
                  type="text"
                  value={petrolPump}
                  onChange={(e) => setPetrolPump(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Fuel Volume</span>
                <input
                  type="number"
                  value={fuelVolume}
                  onChange={(e) => setFuelVolume(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Fuel Rate</span>
                <input
                  type="number"
                  value={fuelRate}
                  onChange={(e) => setFuelRate(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Cash Received</span>
                <input
                  type="number"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Payment Term</span>
                <input
                  type="text"
                  value={paymentTerm}
                  onChange={(e) => setPaymentTerm(e.target.value)}
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
