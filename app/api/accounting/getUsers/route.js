import ledger from "../../../models/accounting/ledgerModel";
import usermodel from "../../../models/usermodel";

import connectDB from "../../../middleware/connectDB";

export async function POST(req, context) {

    try {
      const { adminId, query } = await req.json();
      await connectDB();
      const admin = await usermodel.findOne({
        $and: [
          { _id: adminId },
          {
            $or: [{ isAdmin: true }, { isOwner: true }],
          },
        ],
      });
      if (!admin) {
        return Response.json(
          { message: "Admin does not exist" },
          { status: 404 },
        );
      }

      //   // Check if there's a text index on the 'consignorName' field
      //   const indexes = db.bookings.getIndexes();
      //   const textIndexExists = indexes.some(
      //     (index) => index.key && index.key.consignorName === "text",
      //   );

      //   if (textIndexExists) {
      //     console.log("A text index on 'consignorName' field exists.");
      //   } else {
      //     await bookings.createIndex({ consignorName: "text" });

      //   }

      // Check if there's a text index on the 'consignorName' field
        const indexes = await ledger.collection.getIndexes();
        console.log(indexes);
      const textIndexExists = Object.keys(indexes).some(
        (key) => indexes[key].key && indexes[key].key.consignorName === "text",
      );

      // If the text index doesn't exist, create it
        if (!textIndexExists) 
                 await ledger.createIndexes({ "basicInfo.accountName": "text" });
      

       const users = await ledger
         .find({ $text: { $search: query } }, { score: { $meta: "textScore" } })
         .sort({ score: { $meta: "textScore" } });

      console.log(users.length);
      return Response.json({ message: "successfull", users }, { status: 200 });
    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 500 });
    }
}