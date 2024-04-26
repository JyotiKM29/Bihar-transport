import connectDB from "../../middleware/connectDB";
import user from "../../models/usermodel";
import productmodel from "../../models/productmodel";

export async function POST(req, res) {
  try {
    const {
      adminId,
      productName,
      hsnNo,
      packageGroup,
      packageType,
      weightType,
      tax,
      conversionFactor,
    } = await req.json();
    await connectDB();

    const admin = await user.find({
      $and: [
        { _id: adminId },
        {
          $or: [{ isAdmin: true }, { isOwner: true }],
        },
      ],
    });

    if (!admin) {
      return Response.json({ message: "Admin not found" }, { status: 404 });
    }

    const alreadyProduct = await productmodel.findOne({ hsnNo });
    if (alreadyProduct)
      return Response.json(
        { message: "product already exists" },
        { status: 404 },
      );

    console.log(alreadyProduct);

    const product = new productmodel({
      name: productName,
      hsnNo,
      packageGroup,
      packageType,
      weightType,
      tax,
      conversionFactor,
    });

    await product.save();
    console.log("no problem");
    // yhey
    return Response.json(
      { message: "Product added successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.log("error : ", error);
    return Response.json({ message: error.message }, { status: 404 });
  }
}
