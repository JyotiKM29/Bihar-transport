import usermodel from "@/app/models/usermodel";
import connectDB from "@/app/middleware/connectDB";
import bookingmodel from "@/app/models/bookingmodel";

export async function POST(req, res) {
  try {
    // Record the start time
    const startTime = new Date();

    await connectDB();
    const { adminId, bookingId, location, date, time } = await req.json();

    const admin = await usermodel.findOne({
      _id: adminId,
      $or: [{ isAdmin: true }, { isOwner: true }],
    });
    if (!admin) {
        return Response.json({ message: "Admin not found" }, { status: 404 });
    }

    const booking = await bookingmodel.findById(bookingId);
    if (!booking) {
        return Response.json({ message: "Booking not found" }, { status: 404 })
      }
      
      const updatedBy = { adminId: admin._id, name: admin.name };
    

    const locationData = { location, date, time,updatedBy };
    booking.location
      ? booking.location.push(locationData)
          : (booking.location = [locationData]);
      
    booking.updatedBy
      ? booking.updatedBy.push({
          name: admin.name,
          adminId: admin._id,
          date: new Date(),
        })
      : (booking.updatedBy = [
          {
            name: admin.name,
            adminId: admin._id,
            date: new Date(),
          },
        ]);
    const result = await booking.save();

    // Calculate the time elapsed
    const endTime = new Date();
    const elapsedTime = endTime - startTime;

    console.log("Time taken:", elapsedTime, "ms");

      return Response.json({result, message: "Location added successfully" });
  } catch (error) {
    console.error(error);
      return Response.json({ message: error.message }, { status: 500 });
  }
}
