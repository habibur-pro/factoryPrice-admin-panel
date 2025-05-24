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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAddCategoryMutation,
  useGetAllCategoryQuery,
  useGetSubcategoryQuery,
} from "@/redux/api/categoryApi";
import { useAddSubcategoryMutation } from "@/redux/api/subcategoryApi";
import { ICategory, ISubcategory } from "@/types";
import { FileText, Plus, Upload, X } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";

interface PricingTier {
  quantity: number;
  price: number;
}

interface BasicInfoProps {
  pricing: PricingTier[];
  setPricing: React.Dispatch<React.SetStateAction<PricingTier[]>>;
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const BasicInfo = ({ pricing, setPricing, tags, setTags }: BasicInfoProps) => {
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
  const [addCategory] = useAddCategoryMutation();
  const [addSubcategory] = useAddSubcategoryMutation();
  const { data: categoryRes } = useGetAllCategoryQuery("");
  const { data: subcategoryRes } = useGetSubcategoryQuery(selectedCategory, {
    skip: !selectedCategory,
  });
  const categories = categoryRes?.data;
  const subcategories = subcategoryRes?.data;
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
    // Get the highest quantity from current tiers
    const highestQuantity = pricing.reduce(
      (max, tier) => (tier.quantity > max ? tier.quantity : max),
      0
    );

    // Add a new tier with quantity 5 more than the highest
    setPricing([
      ...pricing,
      {
        quantity: highestQuantity + 5,
        price: 0,
      },
    ]);
  };

  // Remove a pricing tier
  const removePricingTier = (index: number) => {
    if (pricing.length > 1) {
      setPricing(pricing.filter((_, i) => i !== index));
    }
  };

  // Update pricing tier
  const updatePricing = (
    index: number,
    field: keyof PricingTier,
    value: number
  ) => {
    const newPricing = [...pricing];
    newPricing[index] = { ...newPricing[index], [field]: value };
    setPricing(newPricing);
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
        await addCategory(formData).unwrap();
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
        await addSubcategory(formData).unwrap();
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
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <div className="flex gap-2">
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select product category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories?.length &&
                      categories.map((category: ICategory) => (
                        <SelectItem
                          className="capitalize"
                          key={category.categoryName}
                          value={category.categoryName}
                        >
                          {category.categoryName}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                <Dialog
                  open={categoryDialogOpen}
                  onOpenChange={setCategoryDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Category</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div>
                        <Label htmlFor="category-name">Category Name</Label>
                        <Input
                          id="category-name"
                          placeholder="Enter category name"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category-icon">Category Icon</Label>
                        <div className="flex items-center gap-2 mt-2">
                          <Input
                            id="category-icon"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) setNewCategoryIcon(file);
                            }}
                          />
                          <Button
                            variant="outline"
                            className="w-full justify-start text-muted-foreground"
                            onClick={() =>
                              document.getElementById("category-icon")?.click()
                            }
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            {newCategoryIcon
                              ? newCategoryIcon.name
                              : "Upload icon"}
                          </Button>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setCategoryDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddCategory}
                        disabled={!newCategoryName}
                      >
                        Add Category
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="subcategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subcategory</FormLabel>
              <div className="flex gap-2">
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!selectedCategory}
                >
                  <FormControl>
                    <SelectTrigger className="flex-1">
                      <SelectValue
                        placeholder={
                          selectedCategory
                            ? "Select subcategory"
                            : "Select a category first"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subcategories?.length &&
                      subcategories.map((subcategory: ISubcategory) => (
                        <SelectItem
                          className="capitalize"
                          key={subcategory.categoryName}
                          value={subcategory.categoryName}
                        >
                          {subcategory.categoryName}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                <Dialog
                  open={subcategoryDialogOpen}
                  onOpenChange={setSubcategoryDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={!selectedCategory}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Subcategory</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div>
                        <Label htmlFor="subcategory-name">
                          Subcategory Name
                        </Label>
                        <Input
                          id="subcategory-name"
                          placeholder="Enter subcategory name"
                          value={newSubcategoryName}
                          onChange={(e) =>
                            setNewSubcategoryName(e.target.value)
                          }
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="subcategory-icon">
                          Subcategory Icon
                        </Label>
                        <div className="flex items-center gap-2 mt-2">
                          <Input
                            id="subcategory-icon"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) setNewSubcategoryIcon(file);
                            }}
                          />
                          <Button
                            variant="outline"
                            className="w-full justify-start text-muted-foreground"
                            onClick={() =>
                              document
                                .getElementById("subcategory-icon")
                                ?.click()
                            }
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            {newSubcategoryIcon
                              ? newSubcategoryIcon.name
                              : "Upload icon"}
                          </Button>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setSubcategoryDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddSubcategory}
                        disabled={!newSubcategoryName}
                      >
                        Add Subcategory
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="pt-6 border-t">
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

        <div className=" pt-6 border-t space-y-2">
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

      <div className="pt-6 border-t">
        <div className="mb-4">
          <h4 className="text-md font-medium">Pricing</h4>
          <p className="text-sm text-muted-foreground">
            Set the base price and quantity-based pricing tiers
          </p>
        </div>

        <div className="space-y-6">
          <FormField
            control={control}
            name="basePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Base Price</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">
                      $
                    </span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      className="pl-7"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        field.onChange(isNaN(value) ? 0 : value);
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-3">
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
              <div className="grid grid-cols-[1fr,1fr,auto] gap-2 p-3 bg-secondary/30 text-sm font-medium">
                <div>Quantity</div>
                <div>Price per unit ($)</div>
                <div></div>
              </div>

              {pricing.map((tier, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[1fr,1fr,auto] gap-2 p-3 items-center border-t"
                >
                  <div>
                    <Input
                      type="number"
                      min="1"
                      value={tier.quantity}
                      onChange={(e) =>
                        updatePricing(
                          index,
                          "quantity",
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
              Set different price points based on order quantity. For example,
              $10 each for 1-9 units, $8.50 each for 10+ units.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;
