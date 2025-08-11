import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAddSubcategoryMutation } from "@/redux/api/subcategoryApi";
import { FileText, Plus, X } from "lucide-react";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";
import { ProductVariantType } from "@/enum";
import { NestedCategorySelector } from "./NestedCategorySelector";

// interface PricingTier {
//   minQuantity: number;
//   maxQuantity: number;
//   price: number;
// }

// QuantityBasedDiscountTierType
interface IQuantityBasedDiscountTier {
  minQuantity: number;
  maxQuantity: number;
  discount: number;
}

// PriceBasedDiscountTierType
// interface IPriceBasedDiscountTier {
//   minPrice: number;
//   maxPrice: number;
//   discount: number;
// }

interface BasicInfoProps {
  quantityBasedDiscountTier: IQuantityBasedDiscountTier[];
  setQuantityBasedDiscountTier: React.Dispatch<
    React.SetStateAction<IQuantityBasedDiscountTier[]>
  >;
  // priceBasedDiscountTier: IPriceBasedDiscountTier[];
  // setPriceBasedDiscountTier: React.Dispatch<
  //   React.SetStateAction<IPriceBasedDiscountTier[]>
  // >;
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  variantType: ProductVariantType;
  discountType: "price" | "quantity";
  setDiscountType: React.Dispatch<React.SetStateAction<"price" | "quantity">>;
}

const BasicInfo = ({
  quantityBasedDiscountTier,
  setQuantityBasedDiscountTier,
  // priceBasedDiscountTier,
  // setPriceBasedDiscountTier,
  tags,
  setTags,
  variantType,
  discountType,
  setDiscountType,
}: BasicInfoProps) => {
  const { control, watch } = useFormContext();
  const selectedCategory = watch("category");

  // States for category/subcategory management
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState<File | null>(null);
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [newSubcategoryIcon, setNewSubcategoryIcon] = useState<File | null>(
    null
  );
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [subcategoryDialogOpen, setSubcategoryDialogOpen] = useState(false);

  // redux
  // const [addCategory] = useAddCategoryMutation();
  // const [addSubcategory] = useAddSubcategoryMutation();
  // const { data: categoryRes } = useGetAllCategoryQuery("");
  // const { data: subcategoryRes } = useGetSubcategoryQuery(selectedCategory, {
  //   skip: !selectedCategory,
  // });
  // const categories = categoryRes?.data;
  // const subcategories = subcategoryRes?.data;
  const [tagInput, setTagInput] = useState("");
  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };
  // Add a new pricing tier
  const addPricingTier = () => {
    if (discountType === "quantity") {
      const highestMax = quantityBasedDiscountTier.reduce(
        (max, tier) => (tier.maxQuantity > max ? tier.maxQuantity : max),
        0
      );

      setQuantityBasedDiscountTier([
        ...quantityBasedDiscountTier,
        {
          minQuantity: highestMax + 1,
          maxQuantity: highestMax + 50,
          discount: 0,
        },
      ]);
    } else if (discountType === "price") {
      const highestMax = priceBasedDiscountTier.reduce(
        (max, tier) => (tier.maxPrice > max ? tier.maxPrice : max),
        0
      );

      setPriceBasedDiscountTier([
        ...priceBasedDiscountTier,
        {
          minPrice: highestMax + 1,
          maxPrice: highestMax + 100,
          discount: 0,
        },
      ]);
    }
  };

  // Remove a pricing tier
  const removePricingTier = (index: number) => {
    if (quantityBasedDiscountTier.length > 1) {
      setQuantityBasedDiscountTier(
        quantityBasedDiscountTier.filter((_, i) => i !== index)
      );
    }
  };

  // Update pricing tier
  const updatePricing = (
    index: number,
    field: keyof IQuantityBasedDiscountTier,
    value: number
  ) => {
    const newPricing = [...quantityBasedDiscountTier];
    newPricing[index] = { ...newPricing[index], [field]: value };
    setQuantityBasedDiscountTier(newPricing);
  };

  // Handle new category creation
  const handleAddCategory = async () => {
    if (newCategoryName) {
      const value = newCategoryName.toLowerCase().replace(/\s+/g, "-");
      const catData = { Label: newCategoryName, value, icon: newCategoryIcon };
      const formData = new FormData();
      formData.append("categoryName", catData.value);
      formData.append("slug", catData.value);
      if (catData.icon) {
        formData.append("icon", catData.icon);
      }
      try {
        // await addCategory(formData).unwrap();
        toast.success("category added");
        setCategoryDialogOpen(false);
      } catch (error: any) {
        toast.error(error?.data?.message || error?.message);
      }
    }
  };

  // Handle new subcategory creation
  const handleAddSubcategory = async () => {
    if (newSubcategoryName && selectedCategory) {
      const value = newSubcategoryName.toLowerCase().replace(/\s+/g, "-");
      const formData = new FormData();
      formData.append("categoryName", value);
      formData.append("slug", value);
      if (newSubcategoryIcon) {
        formData.append("icon", newSubcategoryIcon);
      }
      if (selectedCategory) {
        formData.append("parentCategoryName", selectedCategory);
      }
      try {
        // await addSubcategory(formData).unwrap();
        toast.success("subcategory added");
      } catch (error: any) {
        toast.error(error?.data?.message || error?.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start mb-4">
        <FileText className="h-5 w-5 mt-1 mr-2 flex-shrink-0" />
        <div>
          <h3 className="text-md font-medium">Basic Information</h3>
          <p className="text-sm text-muted-foreground">
            Enter the essential details about your product
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="sku"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SKU (Stock Keeping Unit)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., PROD-12345" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="wearHouseNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wear House No</FormLabel>
              <FormControl>
                <Input placeholder="Enter wear house no" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="wearHouseLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wear House Location</FormLabel>
              <FormControl>
                <Input placeholder="Enter wear house locaiton" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <NestedCategorySelector
                  value={field.value}
                  onChange={(categoryId: string) => {
                    // console.log("field change basic info",categoryId)
                    field.onChange(categoryId);
                    // If you need to store the full path:
                    // setValue('categoryPath', selectedPath);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


      </div>

      <div className="space-y-4">
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your product in detail..."
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="minOrderQuantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Min. order quantity (Stock Keeping Unit)</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., PROD-12345"
                  {...field}
                  type="number"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Total Stock without variants */}
        {variantType === ProductVariantType.NO_VARIANT && (
          <FormField
            control={control}
            name="totalQuantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Stock</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., 100"
                    {...field}
                    type="number"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Base price */}
        <FormField
          control={control}
          name="basePrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base Price</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., 100"
                  {...field}
                  type="number"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <div className="flex items-center">
            <FormLabel>Product Tags/Keywords</FormLabel>
          </div>

          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, index) => (
              <div
                key={index}
                className="flex items-center bg-secondary/50 px-3 py-1 rounded-full text-sm"
              >
                <span>{tag}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 ml-1"
                  onClick={() => removeTag(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Add keyword (press Enter)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button type="button" onClick={addTag} disabled={!tagInput.trim()}>
              Add
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Add keywords that help customers find your product
          </p>
        </div>
      </div>

      {/* Radio for select Discount Type */}
       <div className="space-y-2">
        <FormLabel className="block">Discount Type</FormLabel>
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="discountType"
              value="quantity"
              checked={discountType === "quantity"}
              onChange={() => setDiscountType("quantity")}
            />
            Quantity-Based
          </label>
          {/* <label className="flex items-center gap-2">
            <input
              type="radio"
              name="discountType"
              value="price"
              checked={discountType === "price"}
              onChange={() => setDiscountType("price")}
            />
            Price-Based
          </label> */}
        </div>
      </div>

      {discountType === "quantity" && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h5 className="text-sm font-medium">Quantity-Based Discount</h5>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addPricingTier}
              className="flex items-center gap-1"
            >
              <Plus className="h-3 w-3" />
              Add Tier
            </Button>
          </div>

          <div className="border rounded-md overflow-hidden">
            <div className="grid grid-cols-4 gap-2 p-3 bg-secondary/30 text-sm font-medium">
              <div>Min Quantity</div>
              <div>Max Quantity</div>
              <div>Discount(%)</div>
              <div></div>
            </div>

            {quantityBasedDiscountTier.map((tier, index) => (
              <div
                key={index}
                className="grid grid-cols-4 gap-2 p-3 items-center border-t"
              >
                <Input
                  type="number"
                  min="1"
                  value={tier.minQuantity}
                  onChange={(e) =>
                    updatePricing(
                      index,
                      "minQuantity",
                      parseInt(e.target.value) || 1
                    )
                  }
                />
                <Input
                  type="number"
                  min="1"
                  value={tier.maxQuantity}
                  onChange={(e) =>
                    updatePricing(
                      index,
                      "maxQuantity",
                      parseInt(e.target.value) || 1
                    )
                  }
                />
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={tier.discount}
                  onChange={(e) =>
                    updatePricing(
                      index,
                      "discount",
                      parseFloat(e.target.value) || 0
                    )
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removePricingTier(index)}
                  disabled={quantityBasedDiscountTier.length <= 1}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* {discountType === "price" && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h5 className="text-sm font-medium">Price-Based Discount</h5>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addPricingTier}
              className="flex items-center gap-1"
            >
              <Plus className="h-3 w-3" />
              Add Tier
            </Button>
          </div>

          <div className="border rounded-md overflow-hidden">
            <div className="grid grid-cols-4 gap-2 p-3 bg-secondary/30 text-sm font-medium">
              <div>Min Price</div>
              <div>Max Price</div>
              <div>Discount(%)</div>
              <div></div>
            </div>

            {priceBasedDiscountTier.map((tier, index) => (
              <div
                key={index}
                className="grid grid-cols-4 gap-2 p-3 items-center border-t"
              >
                <Input
                  type="number"
                  min="1"
                  value={tier.minPrice}
                  onChange={(e) => {
                    const newTiers = [...priceBasedDiscountTier];
                    newTiers[index] = {
                      ...newTiers[index],
                      minPrice: parseInt(e.target.value) || 1,
                    };
                    setPriceBasedDiscountTier(newTiers);
                  }}
                />
                <Input
                  type="number"
                  min="1"
                  value={tier.maxPrice}
                  onChange={(e) => {
                    const newTiers = [...priceBasedDiscountTier];
                    newTiers[index] = {
                      ...newTiers[index],
                      maxPrice: parseInt(e.target.value) || 1,
                    };
                    setPriceBasedDiscountTier(newTiers);
                  }}
                />
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={tier.discount}
                  onChange={(e) => {
                    const newTiers = [...priceBasedDiscountTier];
                    newTiers[index] = {
                      ...newTiers[index],
                      discount: parseFloat(e.target.value) || 0,
                    };
                    setPriceBasedDiscountTier(newTiers);
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (priceBasedDiscountTier.length > 1) {
                      const newTiers = priceBasedDiscountTier.filter(
                        (_, i) => i !== index
                      );
                      setPriceBasedDiscountTier(newTiers);
                    }
                  }}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}  */}

      {/* Discount by Quantity Tier */}
     {/* <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h5 className="text-sm font-medium">Quantity-Based Discount</h5>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addPricingTier}
            className="flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Tier
          </Button>
        </div>

        <div className="border rounded-md overflow-hidden">
          <div className="grid grid-cols-4 gap-2 p-3 bg-secondary/30 text-sm font-medium">
            <div>Min Quantity</div>
            <div>Max Quantity</div>
            <div>Discount(%)</div>
            <div></div>
          </div>

          {quantityBasedDiscountTier.map((tier, index) => (
            <div
              key={index}
              className="grid grid-cols-4 gap-2 p-3 items-center border-t"
            >
              <div>
                <Input
                  type="number"
                  min="1"
                  value={tier.minQuantity}
                  onChange={(e) =>
                    updatePricing(
                      index,
                      "minQuantity",
                      parseInt(e.target.value) || 1
                    )
                  }
                  className="w-full"
                />
              </div>
              <div>
                <Input
                  type="number"
                  min="1"
                  value={tier.maxQuantity}
                  onChange={(e) =>
                    updatePricing(
                      index,
                      "maxQuantity",
                      parseInt(e.target.value) || 1
                    )
                  }
                  className="w-full"
                />
              </div>
              <div>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={tier.discount}
                  onChange={(e) =>
                    updatePricing(
                      index,
                      "discount",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full"
                />
              </div>
              <div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removePricingTier(index)}
                  disabled={quantityBasedDiscountTier.length <= 1}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          Set different price points based on quantity ranges. For example, $10
          each for 1-9 units, $8.50 each for 10-50 units.
        </p>
      </div>  */}

      {/* Discount by Pricing Tier */}
      {/* <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h5 className="text-sm font-medium">Price-Based Discount</h5>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addPricingTier}
            className="flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Tier
          </Button>
        </div>

        <div className="border rounded-md overflow-hidden">
          <div className="grid grid-cols-4 gap-2 p-3 bg-secondary/30 text-sm font-medium">
            <div>Min Price</div>
            <div>Max Price</div>
            <div>Discount(%)</div>
            <div></div>
          </div>

          {priceBasedDiscountTier.map((tier, index) => (
            <div
              key={index}
              className="grid grid-cols-4 gap-2 p-3 items-center border-t"
            >
              <div>
                <Input
                  type="number"
                  min="1"
                  value={tier.minPrice}
                  onChange={(e) =>
                    updatePricing(
                      index,
                      "minPrice",
                      parseInt(e.target.value) || 1
                    )
                  }
                  className="w-full"
                />
              </div>
              <div>
                <Input
                  type="number"
                  min="1"
                  value={tier.maxQuantity}
                  onChange={(e) =>
                    updatePricing(
                      index,
                      "maxQuantity",
                      parseInt(e.target.value) || 1
                    )
                  }
                  className="w-full"
                />
              </div>
              <div>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={tier.discount}
                  onChange={(e) =>
                    updatePricing(
                      index,
                      "discount",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full"
                />
              </div>
              <div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removePricingTier(index)}
                  disabled={quantityBasedDiscountTier.length <= 1}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          Set different price points based on quantity ranges. For example, $10
          each for 1-9 units, $8.50 each for 10-50 units.
        </p>
      </div> */}

      {/* Pricing Tier */}
      {/* <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h5 className="text-sm font-medium">Quantity-Based Pricing</h5>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addPricingTier}
            className="flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Tier
          </Button>
        </div>

        <div className="border rounded-md overflow-hidden">
          <div className="grid grid-cols-4 gap-2 p-3 bg-secondary/30 text-sm font-medium">
            <div>Min Quantity</div>
            <div>Max Quantity</div>
            <div>Price per unit ($)</div>
            <div></div>
          </div>

          {pricing.map((tier, index) => (
            <div
              key={index}
              className="grid grid-cols-4 gap-2 p-3 items-center border-t"
            >
              <div>
                <Input
                  type="number"
                  min="1"
                  value={tier.minQuantity}
                  onChange={(e) =>
                    updatePricing(
                      index,
                      "minQuantity",
                      parseInt(e.target.value) || 1
                    )
                  }
                  className="w-full"
                />
              </div>
              <div>
                <Input
                  type="number"
                  min="1"
                  value={tier.maxQuantity}
                  onChange={(e) =>
                    updatePricing(
                      index,
                      "maxQuantity",
                      parseInt(e.target.value) || 1
                    )
                  }
                  className="w-full"
                />
              </div>
              <div>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={tier.price}
                  onChange={(e) =>
                    updatePricing(
                      index,
                      "price",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full"
                />
              </div>
              <div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removePricingTier(index)}
                  disabled={pricing.length <= 1}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          Set different price points based on quantity ranges. For example, $10
          each for 1-9 units, $8.50 each for 10-50 units.
        </p>
      </div> */}
    </div>
  );
};

export default BasicInfo;
