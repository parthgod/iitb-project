import Vendor from "@/models/vendor";
import { connectToDatabase } from "@/utils/database";

export const GET = async () => {
  try {
    await connectToDatabase();
    const vendors = await Vendor.find({});
    return new Response(JSON.stringify(vendors), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to fetch vendors", { status: 500 });
  }
};

export const POST = async (req: any) => {
  const { defaultFields, additionalFields } = await req.json();
  try {
    await connectToDatabase();
    const alreadyExists = await Vendor.findOne({ vendorId: defaultFields.vendorId });
    if (alreadyExists) return new Response(JSON.stringify("Vendor already exists"), { status: 409 });
    const newVendor = new Vendor({
      ...defaultFields,
      additionalFields,
    });
    await newVendor.save();
    return new Response(JSON.stringify(newVendor), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to create a new vendor", { status: 500 });
  }
};
