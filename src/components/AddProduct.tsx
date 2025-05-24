"use client";
import { useState } from "react";
import { useForm, FormProvider, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import BasicInfo from "@/components/BasicInfo";
import ProductVariants from "@/components/ProductVariants";
import ProductMedia from "@/components/ProductMedia";
import PromotionsSection from "@/components/PromotionsSection";
import PublishSettings from "@/components/PublishSettings";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
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
import { useRouter } from "next/navigation";
import SpecificationsSection from "./SpecificationsSection";
import { ProductFormValues, productSchema } from "@/validation";

const AddProduct = () => {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [variants, setVariants] = useState<any[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [specs, setSpecs] = useState<
    { group: string; key: string; value: string }[]
  >([]);
  const [pricing, setPricing] = useState<{ quantity: number; price: number }[]>(
    [{ quantity: 1, price: 0 }]
  );
  const [saving, setSaving] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);

  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      sku: "",
      category: "",
      subcategory:"",
      description:"",
      basePrice: 0,
      isActive: false,
    },
  });

  const onSubmit = async (data: FieldValues) => {
    if (tags?.length === 0) {
      toast.error("Tags is required.");
      return;
    }
    if (pricing?.length === 0) {
      toast.error("Pricing is required.");
      return;
    }
    if (variants?.length === 0) {
      toast.error("Variant is required.");
      return;
    }
    if (specs?.length === 0) {
      toast.error("Specification is required.");
      return;
    }

    if (images?.length === 0) {
      toast.error("Please upload at least one image.");
      return;
    }
    try {
      console.log("Form Data:", {
        ...data,
        images,
        variants,
        tags,
        specs,
        pricing,
      });
      setSaving(true);
      toast.success("Product saved successfully!");

      // Navigate back to products page after successful save
      // setTimeout(() => {
      //   router.push("/dashboard/products");
      // }, 2000);
    } catch (error) {
      toast.error("Failed to save product");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const saveAsDraft = () => {
    const formData = methods.getValues();
    console.log("Draft saved:", {
      ...formData,
      images,
      variants,
      tags,
      specs,
      pricing,
      status: "draft",
    });
    toast.success("Draft saved successfully");
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
      specs.length > 0 ||
      pricing.length > 1 ||
      pricing[0].price !== 0;

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
              <Button variant="outline" type="button" onClick={saveAsDraft}>
                Save as Draft
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Product"}
              </Button>
            </div>
          </div>
          <Separator />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
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
                      pricing={pricing}
                      setPricing={setPricing}
                    />
                  </AccordionContent>
                </AccordionItem>

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
                    />
                  </AccordionContent>
                </AccordionItem>

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

                <AccordionItem
                  value="seo"
                  className="border rounded-lg p-1 mt-4"
                >
                  <AccordionTrigger className="px-4">
                    SEO & Description
                  </AccordionTrigger>
                </AccordionItem>

                <AccordionItem
                  value="promotions"
                  className="border rounded-lg p-1 mt-4"
                >
                  <AccordionTrigger className="px-4">
                    Promotions & Offers
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-2">
                    <PromotionsSection />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className="space-y-6">
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Product Media</h3>
                <ProductMedia images={images} setImages={setImages} />
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

export default AddProduct;
