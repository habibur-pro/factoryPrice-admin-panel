"use client";
import BasicInfo from "@/components/BasicInfo";
import ProductMedia from "@/components/ProductMedia";
import PromotionsSection from "@/components/PromotionsSection";
import PublishSettings from "@/components/PublishSettings";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAddProductMutation } from "@/redux/api/productApi";
import { ProductFormValues, productSchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import ProductVariants from "./ProductVariants";
import SpecificationsSection, { Specification } from "./SpecificationsSection";

import { ProductVariantType } from "@/enum";
interface SizeQuantity {
  size: string;
  quantity: string;
}

interface ColorVariant {
  color: string;
  sizes: SizeQuantity[];
}
export const AddProduct = () => {
  const router = useRouter();
  // Track variant selection type (with or without variant)
  const [variantType, setVariantType] = useState<ProductVariantType>(
    ProductVariantType.NO_VARIANT
  );

  const [totalQuantity, setTotalQuantity] = useState(0);

  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      sku: "",
      category: "",
      description: "",
      wearHouseNo: "",
      wearHouseLocation: "",
      isActive: false,
      variantType: ProductVariantType.NO_VARIANT,
      minOrderQuantity: 1,
      totalQuantity: totalQuantity,
      basePrice: 0,
    },
  });
  const { errors } = methods.formState;
  const [discountType, setDiscountType] = useState<"price" | "quantity">(
    "quantity"
  );
  const [addProductMutation] = useAddProductMutation();
  const [images, setImages] = useState<File[]>([]);
  const [videoURL, setVideoURL] = useState("");
  const [variants, setVariants] = useState<ColorVariant[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [specs, setSpecs] = useState<Array<Specification>>([]);
  // QuantityBasedDiscountTier
  const [quantityBasedDiscountTier, setQuantityBasedDiscountTier] = useState<
    { minQuantity: number; maxQuantity: number; discount: number }[]
  >([{ minQuantity: 10, maxQuantity: 50, discount: 0 }]);

  // PriceBasedDiscountTier
  const [priceBasedDiscountTier, setPriceBasedDiscountTier] = useState<
    { minPrice: number; maxPrice: number; discount: number }[]
  >([{ minPrice: 10, maxPrice: 50, discount: 0 }]);
  // pricing tier
  // const [pricing, setPricing] = useState<
  //   { minQuantity: number; maxQuantity: number; price: number }[]
  // >([{ minQuantity: 10, maxQuantity: 50, price: 0 }]);
  const [saving, setSaving] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);

  const onSubmit = async (data: FieldValues) => {
    data.variantType = variantType;
    data.discountType = discountType;

    if (tags?.length === 0) {
      toast.error("Tags is required.");
      return;
    }
    
    // if (pricing?.length === 0) {
    //   toast.error("Pricing is required.");
    //   return;
    // }
    // if (variants?.length === 0) {
    //   toast.error("Variant is required.");
    //   return;
    // }
    // if (specs?.length === 0) {
    //   toast.error("Specification is required.");
    //   return;
    // }

    if (images?.length === 0) {
      toast.error("Please upload at least one image.");
      return;
    }

    try {
      const formData = new FormData();
      const quantityToSubmit =
        variantType === ProductVariantType.DOUBLE_VARIANT
          ? totalQuantity
          : data.totalQuantity;

      const productData = {
        ...data,
        variants,
        tags,
        specs,
        totalQuantity: quantityToSubmit,
        
        videoURL,
        ...(discountType === "price"
          ? { priceBasedDiscountTier }
          : { quantityBasedDiscountTier }),
      };

      console.log("prodcut data", productData);

      formData.append("data", JSON.stringify(productData));
      images.forEach((image) => {
        formData.append("productImage", image);
      });
      if (videoURL) {
        formData.append("videoURL", videoURL);
      }

      setSaving(true);
      await addProductMutation(formData).unwrap();
      toast.success("Product saved successfully!");
      router.push("/products");
    } catch (error) {
      toast.error("Failed to save product");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Check if there's unsaved data before showing the confirmation dialog
    const formData = methods.getValues();
    const isDirty =
      formData.name !== "" ||
      formData.sku !== "" ||
      images.length > 0 ||
      variants.length > 0 ||
      tags.length > 0 ||
      specs.length > 0;
      // pricing.length > 1 ||
      // pricing[0].price !== 0;

    if (isDirty) {
      setShowDiscardDialog(true);
    } else {
      router.push("/dashboard/products");
    }
  };

  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Product Information</h2>
            <div className="flex gap-2">
              <AlertDialog
                open={showDiscardDialog}
                onOpenChange={setShowDiscardDialog}
              >
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Discard changes?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You have unsaved changes. Are you sure you want to cancel?
                      Any unsaved data will be lost.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Continue Editing</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => router.push("/dashboard/products")}
                    >
                      Discard Changes
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              {/* <Button variant="outline" type="button" onClick={saveAsDraft}>
                Save as Draft
              </Button> */}
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Product"}
              </Button>
            </div>
          </div>
          <Separator />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Variant Type Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Select Variant Type
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="variantType"
                      value={ProductVariantType.NO_VARIANT}
                      checked={variantType === ProductVariantType.NO_VARIANT}
                      onChange={(e) => {
                        setVariantType(
                          e.target.value as ProductVariantType.NO_VARIANT
                        );
                        console.log("Selected:", e.target.value);
                      }}
                    />
                    No Variant
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="variantType"
                      value={ProductVariantType.DOUBLE_VARIANT}
                      checked={
                        variantType === ProductVariantType.DOUBLE_VARIANT
                      }
                      onChange={(e) => {
                        setVariantType(
                          e.target.value as ProductVariantType.DOUBLE_VARIANT
                        );
                        console.log("Selected:", e.target.value);
                      }}
                    />
                    Double
                  </label>
                </div>
              </div>

              <Accordion
                type="single"
                collapsible
                defaultValue="basic-info"
                className="w-full"
              >
                <AccordionItem
                  value="basic-info"
                  className="border rounded-lg p-1"
                >
                  <AccordionTrigger className="px-4">
                    Basic Information
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-2">
                    <BasicInfo
                      tags={tags}
                      setTags={setTags}
                      quantityBasedDiscountTier={quantityBasedDiscountTier}
                      setQuantityBasedDiscountTier={
                        setQuantityBasedDiscountTier
                      }
                      priceBasedDiscountTier={priceBasedDiscountTier}
                      setPriceBasedDiscountTier={setPriceBasedDiscountTier}
                      variantType={variantType}
                      discountType={discountType}
                      setDiscountType={setDiscountType}
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* Product Variants */}

                {variantType === ProductVariantType.DOUBLE_VARIANT ? (
                  <AccordionItem
                    value="variants"
                    className="border rounded-lg p-1 mt-4"
                  >
                    <AccordionTrigger className="px-4">
                      Product Variants
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pt-2">
                      <ProductVariants
                        variants={variants}
                        setVariants={setVariants}
                        setTotalQuantity={setTotalQuantity}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ) : null}
                {/* <AccordionItem
                  value="variants"
                  className="border rounded-lg p-1 mt-4"
                >
                  <AccordionTrigger className="px-4">
                    Product Variants
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-2">
                    <ProductVariants
                      variants={variants}
                      setVariants={setVariants}
                      setTotalQuantity={setTotalQuantity}
                    />
                  </AccordionContent>
                </AccordionItem> */}

                <AccordionItem
                  value="specifications"
                  className="border rounded-lg p-1 mt-4"
                >
                  <AccordionTrigger className="px-4">
                    Specifications
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-2">
                    <SpecificationsSection specs={specs} setSpecs={setSpecs} />
                  </AccordionContent>
                </AccordionItem>

                {/* <AccordionItem
                  value="promotions"
                  className="border rounded-lg p-1 mt-4"
                >
                  <AccordionTrigger className="px-4">
                    Promotions & Offers
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-2">
                    <PromotionsSection />
                  </AccordionContent>
                </AccordionItem> */}
              </Accordion>
            </div>

            <div className="space-y-6">
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Product Media</h3>
                <ProductMedia
                  images={images}
                  setImages={setImages}
                  videoURL={videoURL}
                  setVideoURL={setVideoURL}
                />
              </div>

              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Publish Settings</h3>
                <PublishSettings />
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
