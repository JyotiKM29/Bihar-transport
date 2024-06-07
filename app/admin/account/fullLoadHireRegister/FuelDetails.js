const FuelDetails = ({ data }) => {
  return (
    <div>
      <h2>Booking Details</h2>
      <p>
        <strong>Order Number:</strong> {data.orderNumber}
      </p>
      <p>
        <strong>Date:</strong> {new Date(data.date).toLocaleDateString()}
      </p>
      <p>
        <strong>Status:</strong> {data.status}
      </p>
      <p>
        <strong>Delivery:</strong>{" "}
        {data.delivery?.delivery_details?.unloading_date
          ? new Date(
              data.delivery.delivery_details.unloading_date,
            ).toLocaleDateString()
          : ""}
      </p>
      <p>
        <strong>POD:</strong>{" "}
        {data.delivery?.consignment_info &&
        data.delivery.consignment_info.length > 0
          ? new Date(
              data.delivery.consignment_info[0].delivery_date,
            ).toLocaleDateString()
          : ""}
      </p>

      <h2>Vehicle Details</h2>
      <p>
        <strong>Vehicle Number:</strong> {data.vehicleData?.vehicleNo}
      </p>
      <p>
        <strong>Driver Name:</strong> {data.vehicleData?.driver?.name}
      </p>
      <p>
        <strong>RC:</strong>{" "}
        {data.vehicleData?.rcPhoto?.length > 0 ? "Yes" : "No"}
      </p>
      <p>
        <strong>License:</strong>{" "}
        {data.vehicleData?.driver?.licenseNo ? "Yes" : "No"}
      </p>

      <h2>LR Details</h2>
      <p>
        <strong>From:</strong> {data.loadingPoints}
      </p>
      <p>
        <strong>To:</strong> {data.unloadingPoints}
      </p>
      <p>
        <strong>Driver Name:</strong> {data.vehicleData?.driver?.name}
      </p>
      <p>
        <strong>RC:</strong>{" "}
        {data.vehicleData?.rcPhoto?.length > 0 ? "Yes" : "No"}
      </p>
      <p>
        <strong>License:</strong>{" "}
        {data.vehicleData?.driver?.licenseNo ? "Yes" : "No"}
      </p>

      <h2>Payment Details</h2>
      <p>
        <strong>Charged Amount:</strong>{" "}
        {data.vehicleData?.bookedBy[0]?.netBhara}
      </p>
      <p>
        <strong>Balance Amount:</strong>{" "}
        {data.vehicleData?.bookedBy[0]?.balanceAmount}
      </p>
      <p>
        <strong>Advance Amount:</strong>{" "}
        {data.vehicleData?.bookedBy[0]?.advanceAmount
          ? data.vehicleData?.bookedBy[0]?.advanceAmount
          : 0}
      </p>
      <p>
        <strong>Paid Amount:</strong>{" "}
        {data.vehicleData?.bookedBy[0]?.totalPaidAmount
          ? data.vehicleData?.bookedBy[0]?.totalPaidAmount
          : data.vehicleData?.bookedBy[0]?.netBhara -
            data.vehicleData?.bookedBy[0]?.balanceAmount}
      </p>
    </div>
  );
};

export default FuelDetails;
