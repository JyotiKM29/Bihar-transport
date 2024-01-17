import user from "../../models/usermodel";

export async function POST(req, res) {
  try {
    const { ownerId, adminId } = await req.json();

    // check if owner exists

    const owner = await user.findById(ownerId);
    if (!owner) {
      return Response.json(
        { message: "Owner not found" },
        {
          status: 404,
        },
      );
    }

    // check if admin exists
    const admin = await user.findOne({ _id: adminId });

    if (!admin) {
      return Response.json(
        { message: "Admin not found" },
        {
          status: 404,
        },
      );
    }

    // handle success

    admin.isAdmin = false;
    await admin.save();

    return Response.json(
      { message: "Admin revoked successfully" },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: error.message },
      {
        status: 400,
      },
    );
  }
}

export async function GET(req, res) {
  Response.json(
    { message: "Method not allowed" },
    {
      status: 405,
    },
  );
}

export async function PUT(req, res) {
  Response.json(
    { message: "Method not allowed" },
    {
      status: 405,
    },
  );
}

export async function DELETE(req, res) {
  Response.json(
    { message: "Method not allowed" },
    {
      status: 405,
    },
  );
}
