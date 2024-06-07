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
  const { user } = useContext(UserContext);
  const { toast } = useToast();

  const adminId = user?._id;

  console.log(adminId);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fuelDetails = {
      fuelType,
      date,
      slipCouponNo,
      petrolPump,
      fuelVolume,
      fuelRate,
      cashReceived,
      paymentTerm,
      remarks,
      bookingId:data._id,
    };

    const value = {
       fuelDetails,
       adminId,
       bookingId:data._id,
       vehicleId: data.vehicleData._id,
    }


    console.log(value);
    
    // Replace with your API endpoint
    const response = await fetch(
      "/api/accounting/fullLoadHireRegister/giveFuel",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      },
    );

     setLoading(false);
    const result = await response.json();
    console.log(result);

    if(response.ok){

           displayToast("Given money for petrol", "✅");



    }


    else {
           displayToast("Try again later, there's some error", "✅",result.message);

    }

  };


   const displayToast = (title, action, description = "") => {
     toast({
       title,
       action,
       description,
     });
   };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Booking Details</h2>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <p><strong>Vehicle Hire NO:</strong> {data.orderNumber}</p>
        <p><strong>vehicle No: </strong> {data.vehicleData.vehicleNo}</p>
        <p><strong>Shipping Charge:</strong> {data.vehicleData.bookedBy[0].netBhara}</p>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <p><strong>Owner Name Number:</strong> {data.vehicleData?.owner?.name}</p>
        <p><strong>Driver Name:</strong> {data.vehicleData?.driver?.name}</p>
        <p><strong>Advance Amount:</strong> {data.vehicleData?.bookedBy[0]?.advanceAmount ? data.vehicleData?.bookedBy[0]?.advanceAmount : 0}</p>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <p><strong>Hire Date:</strong> {new Date(data.date).toLocaleDateString()}</p>
                <p><strong>Hire Due:</strong> {data.vehicleData?.bookedBy[0]?.balanceAmount}</p>

        <p><strong>Hire Due:</strong> {data.vehicleData?.bookedBy[0]?.balanceAmount}</p>
       
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Fuel Details</h2>
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
          className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
        >
{loading?"adding...": "Save Fuel Payment"}
        </button>
      </form>
    </div>
  );
};

export default FuelDetails;
