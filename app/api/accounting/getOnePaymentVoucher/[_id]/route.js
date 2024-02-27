import connectDB from "../../../../middleware/connectDB";
import paymentVoucher from "../../../../models/accounting/voucher";

export async function GET(req, context) {
    
    try {
        const { _id } = context.params;
        console.log(_id);
        await connectDB();

        const paymentVoucherData = await paymentVoucher.findOne({ _id });
        if (!paymentVoucherData) {
            return Response.json({ message: "Payment Voucher Not Found" }, { status: 400 });
        }
        return Response.json({ message: "Payment Voucher Details", data: paymentVoucherData }, { status: 200 });

    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 400 });
    }

}

