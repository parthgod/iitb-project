import Vendor from "@/models/vendor";
import { connectToDatabase } from "@/utils/database";

export const GET = async (req: Request, { params }: { params: { vendorId: String } }) => {
  const { vendorId } = params;
  // console.log(vendorId);
  try {
    await connectToDatabase();
    const vendorDetails = await Vendor.findOne({ vendorId: vendorId });
    if (!vendorDetails) return new Response("Vendor not found", { status: 404 });
    return new Response(JSON.stringify(vendorDetails), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to get vendor", { status: 500 });
  }
};

export const PATCH = async (req: Request, { params }: { params: { vendorId: String } }) => {
  const { defaultFields, additionalFields } = await req.json();
  const { vendorId } = params;
  console.log(vendorId);
  try {
    await connectToDatabase();
    const response = await Vendor.findByIdAndUpdate(vendorId, {
      ...defaultFields,
      additionalFields,
    });
    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to edit vendor", { status: 500 });
  }
};

export const DELETE = async (req: Request, { params }: { params: { vendorId: String } }) => {
  const { vendorId } = params;
  try {
    await connectToDatabase();
    const response = await Vendor.findByIdAndDelete(vendorId);
    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to delete vendor", { status: 500 });
  }
};
