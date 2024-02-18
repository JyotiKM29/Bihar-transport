import Booking from "../../../models/bookingmodel";
import connectDB from "../../../middleware/connectDB";
import usermodel from "../../../models/usermodel";
import ledger from "../../../models/accounting/ledgerModel";
import bulkRecieve from "../../../models/accounting/bulkRecieve";


export async function POST(req, res) {

    try {
        
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

        while (payment & i<n) {
         
            if (ledgerData[i].savedBooking.totalAmount >= payment) {
                let data = ledgerData[i].savedBooking.totalAmount;
                ledgerData[i].savedBooking.totalAmount =
                    ledgerData[i].savedBooking.totalAmount - payment;
                payment -= data;
                
                const id = ledgerData[i].savedBooking._id;
                const newbooking = await Booking.findOne({ _id: id });
                 console.log("Booking Data before : ", newbooking);
                newbooking.totalAmount = ledgerData[i].savedBooking.totalAmount;
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
                if (newbooking.totalAmount === 0) {
                  newbooking.paymentStatus = "Paid";
                }

                const booking_data = await newbooking.save();
                console.log("Booking Data after : ",booking_data);
            }

            else {
                
                ledgerData[i].savedBooking.totalAmount -= payment;
                payment = 0;
                // payment -= ledgerData[i].savedBooking.totalAmount;
                const id = ledgerData[i].savedBooking._id;
                const booking = await Booking.findOne({ _id: id });
                 console.log("Booking Data before : ", booking);
                booking.totalAmount = ledgerData[i].savedBooking.totalAmount;
                if (booking.totalAmount === 0) {
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

            i++;
        }


        const newRecieve = new bulkRecieve({
            ledgerId,
            date,
            recieveFrom : ledgerData.basicInfo.accountName,
            recieveAmount,
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
