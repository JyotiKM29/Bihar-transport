
import connectDB from "../../../middleware/connectDB";
import ledger from "../../../models/accounting/ledgerModel";
import user from "../../../models/usermodel";

export async function POST(req, res) {

    try {
        
        const {
            adminId,
            basicInfo,
            accountDetails,
            additionalInfo,
            bankDetails,
            GSTINAadharCardPanCardDrivingLicence
        } = await req.json();

        await connectDB();  

        const admin = await user.findOne({ _id: adminId });

        if (admin && (admin.isAdmin || admin.isOwner)) {

            const existingLedger = await ledger.findOne({
              "basicInfo.contactNo": basicInfo.contactNo,
            });

            if(existingLedger){
              return Response.json({ message: "Ledger already exists" }, { status: 400 });
            }
            
            const newLedger = new ledger({
                basicInfo,
                accountDetails,
                additionalInfo,
                bankDetails,
                GSTINAadharCardPanCardDrivingLicence,
                createdBy: {
                    id: adminId,
                    name: admin.name,
                    date: new Date()
                }
            });

            const ledgerData = await newLedger.save();
            return Response.json({ message: "Ledger created successfully", data: ledgerData }, { status: 200 });

        } else {
            return Response.json({ message: "You are not authorized to create ledger" }, { status: 401 });
        }
    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 500 });
    }
}

export async function GET(req, res) {

    return Response.json({ message: "THis method is not allowed" }, { status: 405 });

}

