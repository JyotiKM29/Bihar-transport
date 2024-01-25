import vehicle from "../../../models/vehicleModel";
import connectDB from "../../../middleware/connectDB";
import user from "../../../models/usermodel";
import Order from '../../../models/orderModel';
import { log } from "console";

export async function GET(req, context,res) {

    try {
        const { params } = context;
        const adminId = params.adminId;
        log(adminId);
        await connectDB();

        const admin = await user.findById(adminId);
        if (!admin || !admin.isAdmin || !admin.isOwner) {
            return Response.json({ message: "admin not found" }, { status: 404 });
        }
        const orderdata = await Order.find(
          {},
          { client: 1, vehicle: 1, payment: 1, status:1 },
        );

        const data = [];
        for (var i = 0; i < orderdata.length; i++) {
            const vehicleData = await vehicle.find({ _id: orderdata[i].vehicle.id }, { "owner.name": 1, "owner.bank": 1 });
            if (vehicleData) {
                
                vehicleData.push({ payment: orderdata[i].payment }); 
                vehicleData.push({ status: orderdata[i].status });
                log(vehicleData);
            }
            data.push(vehicleData);
        }

        
        // log(vehicleData);
        // vehicleData.filter((item) => item.owner)
        // log(vehicleData);

        
        return Response.json({ data }, { status: 200 });
    } catch (error) {
        log(error);
        return Response.json(
          { message:error.message },
          { status: 400 },
        );
        
    }




}


export function POST(req, res) {
    return Response.json({ message: "method not allowed" }, { status: 405 });
}