// pages/api/updateBooking.js
import Booking from "../../models/bookingmodel";
import user from "../../models/usermodel";
import connectDB from "../../middleware/connectDB";

export async function PUT(req, res) {
  try {
    await connectDB();

    const { _id, adminId, fieldsToUpdate } = await req.json();

    console.log("fieldsToUpdate", fieldsToUpdate);

    const admin = await user.findOne({ _id: adminId });
    if (admin && (admin.isAdmin || admin.isOwner)) {
      const existingBooking = await Booking.findOne({ _id });
      if (!existingBooking) {
        return Response.json({ message: "Booking not found" }, { status: 400 });
      }

      const date = new Date();
      const updatedByEntry = {
        name: admin.name,
        adminId: admin._id.toString(),
        date: date,
      };

      const setUpdateObject = {};
      const arrayFilters = [];
      const arrayFilterKeys = {}; // To keep track of unique keys

      // Separate fields to update and fields that require positional filters
      for (const [key, value] of Object.entries(fieldsToUpdate)) {
        if (key.includes("$[")) {
          const parts = key.split(".$[");
          const arrayField = parts[0];
          const arrayIndex = parts[1].split("]")[0];

          // Ensure unique array filter keys with valid names
          if (!arrayFilterKeys[arrayField]) {
            arrayFilterKeys[arrayField] =
              `elem${Object.keys(arrayFilterKeys).length}`;
          }
          const uniqueArrayKey = arrayFilterKeys[arrayField];

          const newKey = key.replace(
            `$[${arrayIndex}]`,
            `$[${uniqueArrayKey}]`,
          );
          setUpdateObject[newKey] = value;
          arrayFilters.push({ [uniqueArrayKey]: { $exists: true } });
        } else {
          setUpdateObject[key] = value;
        }
      }

      const updateQuery = {
        $set: setUpdateObject,
        $push: { updatedBy: updatedByEntry },
      };

      const updateOptions = arrayFilters.length > 0 ? { arrayFilters } : {};

      await Booking.updateOne({ _id }, updateQuery, updateOptions);

      const updatedBooking = await Booking.findOne({ _id });

      return Response.json(
        {
          message: "Booking updated successfully",
          booking: updatedBooking,
        },
        { status: 200 },
      );
    } else {
      return Response.json(
        { message: "Admin does not exist" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error updating booking:", error.message);

    return Response.json(
      {
        message: "Please check your input",
        error: error.message,
      },
      { status: 400 },
    );
  }
}

export async function GET(req, res) {
  return Response.json({ message: "Method Not Allowed" }, { status: 400 });
}

export async function POST(req, res) {
  return Response.json({ message: "Method Not Allowed" }, { status: 400 });
}
