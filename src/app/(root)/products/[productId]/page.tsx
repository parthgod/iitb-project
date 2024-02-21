import FormSkeleton from "@/components/FormSkeleton";
import CreateForm from "@/components/CreateForm";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getProductById } from "@/lib/actions/product.actions";
import { Suspense } from "react";
import { IProduct } from "@/lib/database/models/product";
import { IDefaultParamSchema } from "@/lib/database/models/defaultParams";

interface EditProductProps {
  params: {
    productId: String;
  };
}

const calculateDefaultValues = (productDetails: IProduct, defaultParams: IDefaultParamSchema[]) => {
  if (Object.keys(productDetails).length && defaultParams.length) {
    const values: any = {};
    defaultParams?.[0].productColumns.forEach((item) => {
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
    <div className="flex flex-col gap-5">
      <p className="font-bold text-3xl">Edit product</p>
      <Suspense fallback={<FormSkeleton />}>
        <CreateForm
          formFields={defaultParams[0].productColumns}
          formDetails={defaultValues}
          type="Product"
        />
      </Suspense>
    </div>
  );
};

export default EditProduct;
