import voucher from "../../../models/accounting/voucher";
import user from "../../../models/usermodel";
import Vehicles from "../../../models/vehicleModel";
import connectDB from "../../../middleware/connectDB";
import { log } from "console";


export async function POST(req, res) {
    try {

        const { adminId, paymentDate, vehicleId, paidAmount, TDS, paidBy, narration } = await req.json();
        await connectDB();
        
        const admin = await user.findOne({
            $and: [{ _id: adminId },
                {
                    $or: [{ isAdmin: true }, { isOwner: true }]
                }]
        });
        if (!admin) {
            return Response.json({ message: "Admin does not exist" }, { status: 404 });
        }


        const vehicle = await Vehicles.findOne({ _id: vehicleId });
        if (!vehicle) {
            return Response.json(
              { message: "Vehicle does not exist" },
              { status: 404 },
            );
        }

        const party = vehicle.owner.name;
        const paidTo = {
            vehicleId: vehicleId,
            vehicleNo: vehicle.vehicleNo,
            ownerName: vehicle.owner.name,
            driverName: vehicle.driver.name
        };
let payment = paidAmount;
let n = vehicle.bookedBy.length;

// console.log("Number of bookings:", n);
// console.log("Initial payment amount:", payment);

if (n > 0) {
    // console.log("Processing bookings...");

    while (payment > 0 && n > 0) {
        const bookedBy = vehicle.bookedBy[n - 1];
        if (payment > bookedBy.netBhara) {
            payment = payment - bookedBy.netBhara;
            bookedBy.netBhara = 0;
            bookedBy.status = "Paid";
        }
        else {
            bookedBy.netBhara = bookedBy.netBhara - payment;
            // console.log("Remaining netBhara for this booking:", bookedBy.netBhara);
            payment = 0;
        }
        n = n - 1;
    }

//     console.log("Bookings processed successfully!");


// console.log("Final payment amount:", payment);
// console.log("Updated bookedBy array:", vehicle.bookedBy);


            if(!vehicle.updatedBy) vehicle.updatedBy = [];

            vehicle.updatedBy.push({
                name: admin.name,
                adminId: adminId,
                date: Date.now()
            });

            if (!vehicle.payment) vehicle.payment = [];
            
                vehicle.payment.push({
                    paymentDate,
                    paidTo,
                    paidAmount,
                    TDS,
                    paidBy,
                    narration,
                    createdBy: {
                        name: admin.name,
                        adminId: adminId
                    },
                });
            

            await vehicle.save();
        }

        else {
            vehicle.advancePayment = [];
            vehicle.advancePayment.push({
                paymentDate,
                paidTo,
                paidAmount,
                TDS,
                paidBy,
                narration,
                createdBy: {
                    name: admin.name,
                    adminId: adminId
                },
            });
    
    if (!vehicle.updatedBy) vehicle.updatedBy = [];
    vehicle.updatedBy.push({
        name: admin.name,
        adminId: adminId,
        date: Date.now()
    });

            // console.log("advance payment", vehicle.advancePayment);

            await vehicle.save();
        }

        const newVoucher = new voucher({
            paymentDate,
            paidTo,
            TDS,
            paidBy,
            paidAmount,
            narration,
            createdBy: {
                name: admin.name,
                adminId: adminId
            },
        });

        const voucherdata = await newVoucher.save();
        return Response.json(
          { message: "Voucher created successfully", voucherdata },
          { status: 200 },
        );

    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message },{status: 500});
    }

}