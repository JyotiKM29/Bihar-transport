import user from '../../models/usermodel'
import connectDB from '../../middleware/connectDB'
import Booking from '../../models/bookingmodel'
import nodemailer from 'nodemailer'
import { log } from 'console';
import { date } from 'zod';


export async function POST(req, res) {

    try {
      const { adminId, bookingId, name, email } = await req.json();
      await connectDB();

      // check if admin exists
      const admin = await user.findOne({ _id: adminId });
      if (!admin.isAdmin) {
        return Response.json({ message: "Admin not found" }, { status: 400 });
      }

      const existingBooking = await Booking.findOne({ _id: bookingId });
      if (!existingBooking) {
        return Response.json({ message: "Booking not found" }, { status: 400 });
      }

      // email to the user

      const transport = nodemailer.createTransport({
        service: "gmail",
        port: 465,
        secure: true,
        auth: {
          user: process.env.user,
          pass: process.env.pass,
        },
      });

      const mailOptions = {
        from: `"${admin.name} from Bihar Transport" <${process.env.user}>`,
        to: email,
        subject: "Booking Invoice from Bihar Transport",
        text: `Hi ${name}! Your booking has been confirmed.`,
        html: `
          
            <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Example Table</title>
    <style>
        table {
            border-collapse: collapse;
            width: 100%;
        }

        th, td {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
        }

        th {
            background-color: #f2f2f2;
        }
    </style>
</head>
<body>
<p>Hii ${name}, We are glad to confirm your booking. </p>

<h1>Booking Invoice</h1>
<table>
<thead>
        <tr>
            <th>Booking Id</th>
            <th>Booking Status</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>${existingBooking.orderNumber}</td>
            <td>Confirmed</td>
        </tr>
    </tbody>
     <thead>
        <tr>
            <th>Booking Date</th>
            <th>Vehicle Required Date</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>${existingBooking.date}</td>
            <td>${existingBooking.vehicleRequiredDate}</td>
        </tr>
    </tbody>

     <thead>
        <tr>
            <th>Source</th>
            <th>Destination</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>${existingBooking.loadingPoints}</td>
            <td>${existingBooking.unloadingPoints}</td>
        </tr>
    </tbody>

     <thead>
        <tr>
            <th>consignor Name</th>
            <th>consignee Name</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>${existingBooking.consigneeName}</td>
            <td>${existingBooking.consignorName}</td>
        </tr>
    </tbody>

     <thead>
        <tr>
            <th>Material</th>
            <th>Quantity</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>${existingBooking.material}</td>
            <td>${existingBooking.chargedWeight} ${existingBooking.rateUnit}</td>
        </tr>
    </tbody>

    <thead>
        <tr>
            <th>advance Amount</th>
            <th>Balance Ammount</th>
            <th>Payment Term</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>${existingBooking.advanceAmount}</td>
            <td>${existingBooking.balanceAmount}</td>
            <td>${existingBooking.paymentTerm}</td>
        </tr>
    </tbody>
   
    
    <!-- Repeat the same pattern for the remaining sections -->
</table>


</body>
</html>

            `,
      };

      const info = await transport.sendMail(mailOptions);
      log("Message sent: %s", info.messageId);
      // Ensure existingBooking.invoice is initialized as an array
      existingBooking.invoice = existingBooking.invoice || [];

      // Then push the new object into the array
      existingBooking.invoice.push({
        sentOn: email,
        name: name,
        // ... (other properties)
      });

      existingBooking.invoice.push(
        {
          sentOn: email,
          sentTo: name,
          generatedBy: {
            name: admin.name,
            id: admin._id,
            date: Date.now(),
          },
          invoiceId: existingBooking.orderNumber,
          invoiceDate: existingBooking.date,
          invoiceAmount: existingBooking.advanceAmount,
          invoiceStatus: "Generated",
          invoiceDueDate: existingBooking.vehicleRequiredDate,
          invoicePaymentTerm: existingBooking.paymentTerm,
          proof: info.messageId,
          timestamps: Date.now(),
        },
      );

      existingBooking.save();

      return Response.json(
        { message: "Invoice sent to the email" },
        { status: 200 },
      );
    } catch (error) {
        log(error)
        return Response.json({ message: error.message }, { status: 400 });
    }

}