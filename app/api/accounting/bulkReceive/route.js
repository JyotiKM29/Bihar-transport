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

        // console.log("admin mil gya...");

        if (!admin) {
            return Response.json({ message: "Admin does not exist" }, { status: 404 });
        }

        const ledgerData = await ledger.findOne({ _id: ledgerId });
        if (!ledgerData) {
            return Response.json({ message: "Ledger does not exist" }, { status: 404 });
        }

        // console.log("ledger mil gya");
        // console.log("ledger booking size: ", ledgerData.booking?.length);


        // console.log("Ledger : ",ledgerData.booking);
        let payment = recieveAmount;
        let n = ledgerData.booking.length;
        let i = 0;

        // console.log(payment, recieveAmount, n);

        // console.log("payment mil gyi ji ...");

        
        

        /*
This algorithm need,
 1. Payment should be distributed in greedy method
 2. Payment should be distributed if the booking still exists if not then not do that,
 3. if booking is canceled or deleted then delete it from the ledger too and also reduce the ledger balance with totalBillingAmount of that booking
 4. If payment is greater than the totalBillingAmount then give them maximum and remaining should be distributed in the next booking
 5. after the payment is done then update the ledger with the remaining balance & with the updated value of booking
        */
        
        if (payment <= 0) {
            return Response, json({ message: "Payment should be greater than 0" }, { status: 400 });
        }
        
        while (payment > 0 && i < n) {

            // console.log("loop ke andar ", i, " li bar");

            // console.log("id:", ledgerData.booking[i]?.savedBooking?._id);
            const _id = ledgerData.booking[i]?.savedBooking?._id;


            // find the booking which is saved inside ledger with booking database
            const bookingData = await Booking.findOne({
              _id,
            });

            
            if ( !bookingData ) {
                // console.log("booking data nahi mila ", ledgerData.booking[i]?.savedBooking?._id , " isliye remove kar diya" );
                ledgerData.booking.splice(i, 1);
                i++;
                continue;
                
            }
            // console.log("booking data mil gya ", bookingData);

            if(bookingData.balanceAmount <= 0 ) {

                // console.log("skip karte hai inka amount 0 hai", bookingData._id, "paidAmount : ", bookingData.totalPaidAmount, "balance amount : ", bookingData.balanceAmount, "total: ", bookingData.totalBillingAmount);
                i++;
                continue;
            }
            
            // if the payment is greater than the totalBillingAmount then give them maximum and remaining should be distributed in the next booking


            if (payment >= bookingData.balanceAmount) {
                // console.log(i, "th time but payment bada hai ", bookingData._id, " booking ki kimat ", bookingData.totalBillingAmount);
                // console.log("before");
                // console.log("balance amount: ", bookingData.balanceAmount);
                // console.log("total paid amount: ", bookingData.totalPaidAmount);

                
                
                // make the payment to booking
                bookingData.paymentHistory.push({
                    date: new Date(),
                    paymentAmount: bookingData.totalBillingAmount,
                    paymentMode,
                    remarks,
                    createdBy: {
                        adminId: adminId,
                        name: admin.name,
                        date: new Date()
                    }
                });

                bookingData.totalPaidAmount += bookingData.totalBillingAmount;
                bookingData.balanceAmount = 0;
            
                
                // update the payment
                payment = payment - bookingData.totalBillingAmount;
                const newBooking = await bookingData.save();
                ledgerData.booking[i].savedBooking = newBooking;
                i++;


                //  console.log("after");
                //  console.log("balance amount: ", newBooking.balanceAmount);
                //  console.log(
                //    "total paid amount: ",
                //    bookingData.totalPaidAmount,
                //  );
            }
            // if payment is lesser than the totalBilling amount of the booking

            else {


                //    console.log(
                //      i,
                //      "th time but payment chhota hai ",
                //      bookingData._id,
                //      " booking ki kimat ",
                //      bookingData.totalBillingAmount,
                //    );
                //    console.log("before");
                //    console.log("balance amount: ", bookingData.balanceAmount);
                //    console.log(
                //      "total paid amount: ",
                //      bookingData.totalPaidAmount,
                //    );

                // make the payment to booking
                bookingData.paymentHistory.push({
                    date: new Date(),
                    paymentAmount: payment,
                    paymentMode,
                    remarks,
                    createdBy: {
                        adminId: adminId,
                        name: admin.name,
                        date: new Date()
                    }
                });

                bookingData.totalPaidAmount += payment;
                bookingData.balanceAmount = bookingData.totalBillingAmount - bookingData.totalPaidAmount;
                payment = 0;
                const newBooking = await bookingData.save();
                ledgerData.booking[i].savedBooking = newBooking;
                i++;

                //   console.log("after");
                //   console.log("balance amount: ", newBooking.balanceAmount);
                //   console.log(
                //     "total paid amount: ",
                //     bookingData.totalPaidAmount,
                //   );

            }
        }

        await ledgerData.save();

        
        


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
