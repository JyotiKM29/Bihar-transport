import user from "../../../../models/usermodel";
import Booking from "../../../../models/bookingmodel";
import Vehicle from "../../../../models/vehicleModel";
import Order from "../../../../models/orderModel";
import connnectDB from "../../../../middleware/connectDB";
import { log } from "console";
import { exists } from "fs";

export async function GET(req, context) {
  try {
    const { params } = context;
    const adminId = params.adminId;
    await connnectDB();

    const admin = user.findById(adminId);
    if (!admin) {
      return Response.json({ message: "admin not found" }, { status: 404 });
    }

    const data = {
      totalOrder: 0,
      pendingOrder: 0,
      orderDispatched: 0,
      lorryInCampus: 0,
      inTransit: 0,
      orderDelivered: 0,
      totalPOD:0,
      pendingPOD: 0,
      ewayWayBillExpiry: 0,
      invoice: 0,
      pendingInvoice: 0,
      generatedInvoice: 0,
      advanceAmount: 0,
      totalAmount: 0,
      advanceBooking: 0,
    };

    // log(data);
    const booking = await Booking.find();
    const dvehicle = await Vehicle.find();
    log(booking.length);

    data.totalOrder = booking.length;

    data.pendingOrder = booking.filter(
      (item) => item.status === "Pending",
    ).length;

    data.orderDispatched = booking.filter(
      (item) => item.status === "Dispatched",
    ).length;
    data.lorryInCampus = dvehicle.length;
    data.inTransit = booking.filter(
      (item) => item.status === "In Transit",
    ).length;
    data.orderDelivered = booking.filter(
      (item) => item.status === "Delivered",
    ).length;

    /*

    need to loop on each and check whether it should be counted inside the totalPOD or not then
    if it counts then check whether it has pending pod or not

    */
    let totalPOD = 0;
    let POD = 0;

    booking.forEach((item) => {
      if (
        item?.dispatch &&
        item?.dispatch?.isDispatched &&
        item?.dispatch?.dispatchDetails?.consignorInvoiceDetails
          ?.isPODCompulsory
      ) {
        totalPOD++;
        if (
          item?.status === "Delivered" &&
          item?.delivery?.consignment_info &&
          Array.isArray(item?.delivery?.consignment_info) &&
          item?.delivery?.consignment_info.length > 0 &&
          item?.delivery?.consignment_info[0]?.pod &&
          item?.delivery?.consignment_info[0]?.pod.length > 0
        ) {
          POD++;
        }
      }
    });

    console.log("totalPOD : ", totalPOD);
    console.log("POD : ", POD);
    data.totalPOD = totalPOD ;

    data.pendingPOD = totalPOD - POD;

    // const totalPOD = booking.filter((item)=>{

    // }).lenght;

    // const POD  = booking.filter(
    //   (item) =>
    //     item.status === "Delivered" &&
    //     item.delivery?.consignment_info &&
    //     Array.isArray(item.delivery.consignment_info) &&
    //     item.delivery.consignment_info.length > 0 &&
    //     item.delivery.consignment_info[0].pod &&
    //     item.delivery.consignment_info[0].pod.length > 0,
    // ).length;

    // const POD  = booking.filter(
    //   (item) =>
    //     item.status === "Delivered" &&
    //     item.delivery?.consignment_info &&
    //     Array.isArray(item.delivery.consignment_info) &&
    //     item.delivery.consignment_info.length > 0 &&
    //     item.delivery.consignment_info[0].pod &&
    //     item.delivery.consignment_info[0].pod.length > 0,
    // ).length;
    // data.pendingPOD = data.orderDelivered - POD;

    /*

     dispatch: {
      isDispatched: { type: Boolean, default: false },
      dispatchDetails: dispatchDetailsSchema,
      dispatchAdditionalDetails: dispatchAdditionalDetailsSchema,
      dispatchAdditionalRate: [dispatchAdditionalRateSchema],
    },


    const dispatchDetailsSchema = new mongoose.Schema({
  billtyType: { type: String },
  dispatchDate: { type: Date },
  dispatchTime: { type: String },
  totalFreight: { type: Number },
  consignorInvoiceDetails: {
    isPODCompulsory: { type: Boolean },
    podType:{type: String},
    consignorInvoiceDate: { type: Date },
    consignorDeliveryNo: { type: String },
    consignorInvoiceNo: { type: String },
    valueOfGoods: { type: Number },
    eWayBillDetails: {
      eWayBillNo: { type: String },
      eWayBillDate: { type: Date },
      expDate: { type: Date },
    },
  },
  dispatch: {
    additionalRateForCompany: { type: Number },
    chargesDetails: [dispatchChargeSchema],
  },
  ledgerBalanceOfParty: { type: String },
  remarks: { type: String },
});


*/

    data.invoice = booking.length;
    // data.generatedInvoice = await Booking.find({
    //   $and: [
    //     { invoice: { $exists: true } },
    //     { $expr: { $gt: [{ $size: "$invoice" }, 0] } },
    //   ],
    // }).countDocuments();
    data.generatedInvoice = await Booking.find({
      invoiceStatus: true,
    }).countDocuments();

    data.pendingInvoice = booking.length - data.generatedInvoice;

    booking.forEach((item) => {
      //  console.log(item.advanceAmount);
      //  console.log(item.balanceAmount);
      // Ensure that advanceAmount and balanceAmount are treated as numbers

      if (isNaN(item.advanceAmount) || isNaN(item.balanceAmount)) {
        console.log(
          "a no error because of this data ",
          item._id,
          item.advanceAmount,
          item.balanceAmount,
          item.status,
        );
        // Booking.deleteOne({_id:item._id}).then((results)=>{console.log("deleted")})
      }
      const advanceAmount = parseFloat(item.advanceAmount);
      const balanceAmount = parseFloat(item.balanceAmount);

      // Check if the parsed values are valid numbers
      if (!isNaN(advanceAmount)) {
        // console.log(data);
        data.advanceAmount += advanceAmount;
      }

      if (!isNaN(balanceAmount)) {
        // Add balanceAmount and advanceAmount to get totalAmount
        //  console.log(item._id);

        data.totalAmount += balanceAmount + advanceAmount;
      }
    });

    data.advanceBooking = booking.filter(
      (item) => item.paymentTerm === "Advance",
    ).length;
    // log(data);

    return Response.json({ data, adminId }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ message: error.message }, { status: 400 });
  }
}
