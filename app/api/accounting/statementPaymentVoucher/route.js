import usermodel from "@/app/models/usermodel";
import connectDB from "@/app/middleware/connectDB";
import voucher from "@/app/models/accounting/voucher";
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { adminId, fromDate, toDate } = await req.json();
    console.log(adminId, fromDate, toDate);

    await connectDB();

    const admin = await usermodel.findOne({
      $and: [{ _id: adminId }, { $or: [{ isAdmin: true }, { isOwner: true }] }],
    });

    if (!admin) {
      return NextResponse.json({ message: "Admin not found" }, { status: 404 });
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);
    // to.setUTCHours(23, 59, 59, 999); // Set to the end of the day

    const voucherData = await voucher.find({
      createdAt: {
        $gte: from,
        $lte: to,
      },
    });

    console.log(voucherData);

    return NextResponse.json({ voucherData }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
