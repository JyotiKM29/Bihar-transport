import usermodel from "@/app/models/usermodel";
import ledger from "@/app/models/accounting/ledgerModel";
import priceSetting from "@/app/models/setting/priceSetting";
import connectDB from "@/app/middleware/connectDB";


export async function POST(req, res) {
    
    try {
        
        const {
          customer,
          customerId,
          fromLocation,
          toLocation,
          searchItemProduct,
          way,
          rateAsPer,
          fromWeight,
          toWeight,
          weightUnit,
          vehicleType,
          fromQty,
          toQty,
          qtyUnit,
          openingKM,
          closingKM,
          fromTrip,
          toTrip,
          partyRate,
          vehicleHireRate,
          additionalCharges,
          adminId,
        } = await req.json();

        


        if (!adminId || !customerId) return Response.json({ message: "AdminId and customerId is required" }, { status: 4000 });
        await connectDB();
        const admin = await usermodel.findOne({ $and: [{ _id: adminId }, { $or: [{ isAdmin: true }, { isOwner: true }] }] });
        if (!admin) return Response.json({ message: "Admin not found" }, { status: 4000 });
        


        const ledgerData = await ledger.findOne({ _id: customerId });
        if (!ledgerData) return Response.json({ message: "Ledger not found" }, { status: 4000 });
        

        const data = new priceSetting({
            customer,
            customerId,
            fromLocation,
            toLocation,
            searchItemProduct,
            way,
            rateAsPer,
            fromWeight,
            toWeight,
            weightUnit,
            vehicleType,
            fromQty,
            toQty,
            qtyUnit,
            openingKM,
            closingKM,
            fromTrip,
            toTrip,
            partyRate,
            vehicleHireRate,
            additionalCharges,
        });

        await data.save();

        return Response.json({ message: "Price setting created successfully" }, { status: 200 });

    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 4000 });
    }




}