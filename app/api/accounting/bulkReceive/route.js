import Booking from "../../../models/bookingmodel";
import connectDB from "../../../middleware/connectDB";
import usermodel from "../../../models/usermodel";
import ledger from "../../../models/accounting/ledgerModel";
import bulkRecieve from "../../../models/accounting/bulkRecieve";


export async function POST(req, res) {

    try {

// remarks
        
        const { adminId, ledgerId, date, recieveAmount, paymentMode, remarks } = await req.json();
        await connectDB();
        const admin = await usermodel.findOne({
            $and: [{ _id: adminId },
                {
                    $or: [{ isAdmin: true }, { isOwner: true }]
                }]
        });

        if (!admin) {
            return Response.json({ message: "Admin does not exist" }, { status: 404 });
        }

        const ledgerData = await ledger.findOne({ _id: ledgerId });
        if (!ledgerData) {
            return Response.json({ message: "Ledger does not exist" }, { status: 404 });
        }

        console.log("Ledger : ",ledgerData.booking);
        let payment = recieveAmount;
        let n = ledgerData.booking.length;
        let i = 0;

        console.log(payment, recieveAmount, n);

        while (payment && i<n) {

              console.log("payment : ", payment);
                console.log("total billing amount after payment  : ", ledgerData.booking[i].savedBooking.totalBillingAmount);


                
                if (ledgerData.booking[i].savedBooking.totalBillingAmount >= payment) {
                    
                    let data = ledgerData.booking[i].savedBooking.totalBillingAmount;
                //  console.log("payment : ", payment);
                // console.log("payment : ", ledgerData[i].savedBooking.totalBillingAmount);

                ledgerData.booking[i].savedBooking.totalBillingAmount =
                    ledgerData.booking[i].savedBooking.totalBillingAmount - payment;
                payment -= data;
                
                const id = ledgerData.booking[i].savedBooking._id;
                const newbooking = await Booking.findOne({ _id: id });
                 console.log("Booking Data before : ", newbooking);
                 if(newbooking) {
                newbooking.totalBillingAmount = ledgerData.booking[i].savedBooking.totalBillingAmount;
                newbooking.paymentHistory.push({
                    date: new Date(),
                    amount: data,
                    paymentMode: paymentMode,
                    remarks: remarks,
                    createdBy: {
                        adminId: adminId,
                        name: admin.name,
                        date: new Date()
                    }
                });
                if (newbooking.totalBillingAmount === 0) {
                  newbooking.paymentStatus = "Paid";
                }

                newbooking.totalPaidAmount+=data;

                const booking_data = await newbooking.save();
                console.log("Booking Data after : ",booking_data);
            }
            }

            else {
                
                ledgerData.booking[i].savedBooking.totalBillingAmount -= payment;
                payment = 0;
                // payment -= ledgerData[i].savedBooking.totalBillingAmount;
                const id = ledgerData.booking[i].savedBooking._id;
                const booking = await Booking.findOne({ _id: id });
                 console.log("Booking Data before : ", booking);
                                  if(booking) {

                booking.totalBillingAmount = ledgerData.booking[i].savedBooking.totalBillingAmount;
                if (booking.totalBillingAmount === 0) {
                    booking.paymentStatus = "Paid";
                }
                booking.paymentHistory.push({
                    date: new Date(),
                    amount: data,
                    paymentMode: paymentMode,
                    remarks: remarks,
                    createdBy: {
                        adminId: adminId,
                        name: admin.name,
                        date: new Date()
                    }
                });
                
                const bookingdata = await booking.save();
                console.log("Booking Data After : ", bookingdata);
            }
        }

            i++;
        }


        const newRecieve = new bulkRecieve({
            ledgerId,
            date,
            recieveAmount,
            recieveFrom : ledgerData.basicInfo.accountName,
            paymentMode,
            remarks,
            createdBy: {
                adminId: adminId,
                name: admin.name,
                date: new Date()
            }
        });

       const newdata = await newRecieve.save();
        return Response.json({ message: "Recieve created successfully", newdata }, { status: 200 });


    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 500 });
    }

}
