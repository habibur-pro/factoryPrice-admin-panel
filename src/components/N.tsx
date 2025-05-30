import { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus, FileText, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface PricingTier {
  minQuantity: number;
  maxQuantity: number;
  price: number;
}

interface BasicInfoProps {
  pricing: PricingTier[];
  setPricing: React.Dispatch<React.SetStateAction<PricingTier[]>>;
}

const BasicInfo = ({ pricing, setPricing }: BasicInfoProps) => {
  const { control, watch, setValue } = useFormContext();
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

  // Mock categories for the select
  const [categories, setCategories] = useState([
    { value: "electronics", label: "Electronics" },
    { value: "clothing", label: "Clothing & Apparel" },
    { value: "home", label: "Home & Garden" },
    { value: "beauty", label: "Beauty & Personal Care" },
    { value: "sports", label: "Sports & Outdoors" },
  ]);

  // Mock subcategories
  const [subcategoriesMap, setSubcategoriesMap] = useState<
    Record<string, { value: string; label: string }[]>
  >({
    electronics: [
      { value: "smartphones", label: "Smartphones" },
      { value: "laptops", label: "Laptops & Computers" },
      { value: "audio", label: "Audio & Headphones" },
      { value: "cameras", label: "Cameras & Photography" },
    ],
    clothing: [
      { value: "mens", label: "Men's Clothing" },
      { value: "womens", label: "Women's Clothing" },
      { value: "kids", label: "Kids & Baby Clothing" },
      { value: "accessories", label: "Accessories" },
    ],
    home: [
      { value: "furniture", label: "Furniture" },
      { value: "kitchen", label: "Kitchen & Dining" },
      { value: "bedding", label: "Bedding & Bath" },
      { value: "decor", label: "Home Decor" },
    ],
    beauty: [
      { value: "skincare", label: "Skincare" },
      { value: "makeup", label: "Makeup" },
      { value: "haircare", label: "Haircare" },
      { value: "fragrances", label: "Fragrances" },
    ],
    sports: [
      { value: "fitness", label: "Fitness Equipment" },
      { value: "outdoor", label: "Outdoor Recreation" },
      { value: "team-sports", label: "Team Sports" },
      { value: "apparel", label: "Sports Apparel" },
    ],
  });

  // Add a new pricing tier
  const addPricingTier = () => {
    // Get the highest maxQuantity from current tiers
    const highestMax = pricing.reduce(
      (max, tier) => (tier.maxQuantity > max ? tier.maxQuantity : max),
      0
    );

    // Add a new tier starting from the next quantity
    setPricing([
      ...pricing,
      {
        minQuantity: highestMax + 1,
        maxQuantity: highestMax + 50,
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
  const handleAddCategory = () => {
    if (newCategoryName) {
      const value = newCategoryName.toLowerCase().replace(/\s+/g, "-");

      // Add new category
      setCategories([
        ...categories,
        {
          value,
          label: newCategoryName,
        },
      ]);

      // Initialize empty subcategories array for this category
      setSubcategoriesMap({
        ...subcategoriesMap,
        [value]: [],
      });

      // Select the new category
      setValue("category", value);
      setValue("subcategory", "");

      // Reset form
      setNewCategoryName("");
      setNewCategoryIcon(null);
      setCategoryDialogOpen(false);
    }
  };

  // Handle new subcategory creation
  const handleAddSubcategory = () => {
    if (newSubcategoryName && selectedCategory) {
      const value = newSubcategoryName.toLowerCase().replace(/\s+/g, "-");

      // Add new subcategory to the selected category
      const updatedSubcategories = {
        ...subcategoriesMap,
        [selectedCategory]: [
          ...(subcategoriesMap[selectedCategory] || []),
          { value, label: newSubcategoryName },
        ],
      };

      setSubcategoriesMap(updatedSubcategories);

      // Select the new subcategory
      setValue("subcategory", value);

      // Reset form
      setNewSubcategoryName("");
      setNewSubcategoryIcon(null);
      setSubcategoryDialogOpen(false);
    }
  };

  // Get subcategories for the currently selected category
  const availableSubcategories = selectedCategory
    ? subcategoriesMap[selectedCategory] || []
    : [];

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
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
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
                    {availableSubcategories.map((subcategory) => (
                      <SelectItem
                        key={subcategory.value}
                        value={subcategory.value}
                      >
                        {subcategory.label}
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
        <div className="mb-4">
          <h4 className="text-md font-medium">Pricing</h4>
          <p className="text-sm text-muted-foreground">
            Set the base price and quantity-based pricing tiers with min/max
            ranges
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
              <div className="grid grid-cols-[1fr,1fr,1fr,auto] gap-2 p-3 bg-secondary/30 text-sm font-medium">
                <div>Min Quantity</div>
                <div>Max Quantity</div>
                <div>Price per unit ($)</div>
                <div></div>
              </div>

              {pricing.map((tier, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[1fr,1fr,1fr,auto] gap-2 p-3 items-center border-t"
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
              Set different price points based on quantity ranges. For example,
              $10 each for 1-9 units, $8.50 each for 10-50 units.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;
