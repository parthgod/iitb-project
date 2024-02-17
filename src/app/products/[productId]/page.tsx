import FormSkeleton from "@/components/FormSkeleton";
import CreateForm from "@/components/CreateForm";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getProductById } from "@/lib/actions/product.actions";
import { Suspense } from "react";

interface EditProductProps {
  params: {
    productId: String;
  };
}

const calculateDefaultValues = (productDetails: any, defaultParams: any): any => {
  if (Object.keys(productDetails).length && defaultParams.length) {
    const values: any = {};
    defaultParams?.[0].productColumns.forEach((item: any) => {
      values[item.field] = productDetails?.[item.field] || productDetails?.additionalFields?.[item.field] || "";
    });
    values["_id"] = productDetails._id;
    return values;
  }
  return {};
};

const EditProduct = async ({ params }: EditProductProps) => {
  const { productId } = params;

  const { data: defaultParams } = (await getDefaultParams()) as any;
  const { data: productDetails } = (await getProductById(productId)) as any;

  const defaultValues = calculateDefaultValues(productDetails, defaultParams);

  return (
    <Suspense fallback={<FormSkeleton />}>
      <CreateForm
        formFields={defaultParams[0].productColumns}
        formDetails={defaultValues}
        type="Product"
      />
    </Suspense>
  );
};

export default EditProduct;
