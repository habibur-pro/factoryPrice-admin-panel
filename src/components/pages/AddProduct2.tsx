"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash, Upload, X, Check, Minus } from "lucide-react";
import { toast } from "sonner";

// Demo categories for the dropdown
const categories = [
  { id: 1, name: "Clothing", subcategories: ["T-Shirts", "Pants", "Jackets"] },
  {
    id: 2,
    name: "Electronics",
    subcategories: ["Phones", "Laptops", "Accessories"],
  },
  {
    id: 3,
    name: "Home & Garden",
    subcategories: ["Furniture", "Decor", "Kitchen"],
  },
];

// Demo colors and sizes for the variant matrix
const initialColors = ["Red", "Blue", "Black"];
const initialSizes = ["S", "M", "L", "XL"];

const AddProduct2 = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [newSubcategoryName, setNewSubcategoryName] = useState<string>("");
  const [parentCategory, setParentCategory] = useState<string>("");
  const [isCategoryModalOpen, setIsCategoryModalOpen] =
    useState<boolean>(false);
  const [isSubcategoryModalOpen, setIsSubcategoryModalOpen] =
    useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [images, setImages] = useState<
    Array<{ id: number; file: File; preview: string }>
  >([]);
  const [nextImageId, setNextImageId] = useState<number>(1);

  // Variant matrix state
  const [colors, setColors] = useState<string[]>(initialColors);
  const [sizes, setSizes] = useState<string[]>(initialSizes);
  const [quantities, setQuantities] = useState<
    Record<string, Record<string, number>>
  >({});
  const [newColor, setNewColor] = useState<string>("");
  const [newSize, setNewSize] = useState<string>("");

  // Basic product info state
  const [productName, setProductName] = useState<string>("");
  const [sku, setSku] = useState<string>("");
  const [basePrice, setBasePrice] = useState<string>("");

  // Dynamic price tiers
  const [priceTiers, setPriceTiers] = useState<
    Array<{ id: number; minQuantity: string; price: string }>
  >([
    { id: 1, minQuantity: "1", price: "" },
    { id: 2, minQuantity: "50", price: "" },
  ]);
  const [nextPriceTierId, setNextPriceTierId] = useState<number>(3);

  // Calculate total inventory from matrix
  const calculateTotalInventory = () => {
    let total = 0;
    Object.keys(quantities).forEach((size) => {
      Object.keys(quantities[size] || {}).forEach((color) => {
        total += quantities[size][color] || 0;
      });
    });
    return total;
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map((file) => {
        const id = nextImageId;
        setNextImageId((prevId) => prevId + 1);
        return {
          id,
          file,
          preview: URL.createObjectURL(file),
        };
      });

      setImages((prevImages) => [...prevImages, ...newImages]);
    }
  };

  // Remove image
  const removeImage = (id: number) => {
    setImages((prevImages) => {
      const newImages = prevImages.filter((img) => img.id !== id);
      const imageToRemove = prevImages.find((img) => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return newImages;
    });
  };

  // Handle drag and drop for images
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const newImages = Array.from(e.dataTransfer.files).map((file) => {
        const id = nextImageId;
        setNextImageId((prevId) => prevId + 1);
        return {
          id,
          file,
          preview: URL.createObjectURL(file),
        };
      });

      setImages((prevImages) => [...prevImages, ...newImages]);
    }
  };

  // Add new color to the matrix
  const addColor = () => {
    if (newColor && !colors.includes(newColor)) {
      setColors((prev) => [...prev, newColor]);
      setNewColor("");
    } else if (colors.includes(newColor)) {
      toast.error("This color already exists");
    }
  };

  // Add new size to the matrix
  const addSize = () => {
    if (newSize && !sizes.includes(newSize)) {
      setSizes((prev) => [...prev, newSize]);
      setNewSize("");
    } else if (sizes.includes(newSize)) {
      toast.error("This size already exists");
    }
  };

  // Remove color from the matrix
  const removeColor = (colorToRemove: string) => {
    setColors(colors.filter((color) => color !== colorToRemove));

    // Clean up quantities for removed color
    const newQuantities = { ...quantities };
    Object.keys(newQuantities).forEach((size) => {
      if (newQuantities[size]) {
        delete newQuantities[size][colorToRemove];
      }
    });
    setQuantities(newQuantities);
  };

  // Remove size from the matrix
  const removeSize = (sizeToRemove: string) => {
    setSizes(sizes.filter((size) => size !== sizeToRemove));

    // Clean up quantities for removed size
    const newQuantities = { ...quantities };
    delete newQuantities[sizeToRemove];
    setQuantities(newQuantities);
  };

  // Update quantity in the matrix
  const updateQuantity = (size: string, color: string, value: number) => {
    setQuantities((prev) => ({
      ...prev,
      [size]: {
        ...(prev[size] || {}),
        [color]: value,
      },
    }));
  };

  // Add new price tier
  const addPriceTier = () => {
    const id = nextPriceTierId;
    setPriceTiers([...priceTiers, { id, minQuantity: "", price: "" }]);
    setNextPriceTierId(id + 1);
  };

  // Remove price tier
  const removePriceTier = (idToRemove: number) => {
    setPriceTiers(priceTiers.filter((tier) => tier.id !== idToRemove));
  };

  // Update price tier
  const updatePriceTier = (
    id: number,
    field: "minQuantity" | "price",
    value: string
  ) => {
    setPriceTiers((prev) =>
      prev.map((tier) => (tier.id === id ? { ...tier, [field]: value } : tier))
    );
  };

  // Sort price tiers by min quantity
  const sortedPriceTiers = [...priceTiers].sort((a, b) => {
    const aVal = parseInt(a.minQuantity) || 0;
    const bVal = parseInt(b.minQuantity) || 0;
    return aVal - bVal;
  });

  // Add new SEO related state variables
  const [productDescription, setProductDescription] = useState<string>("");
  const [keywords, setKeywords] = useState<string>("");
  const [metaTitle, setMetaTitle] = useState<string>("");
  const [metaDescription, setMetaDescription] = useState<string>("");
  const [currentKeyword, setCurrentKeyword] = useState<string>("");
  const [keywordsList, setKeywordsList] = useState<string[]>([]);

  // Add keyword to the list
  const addKeyword = () => {
    if (currentKeyword && !keywordsList.includes(currentKeyword)) {
      setKeywordsList((prev) => [...prev, currentKeyword]);
      setCurrentKeyword("");
    } else if (keywordsList.includes(currentKeyword)) {
      toast.error("This keyword already exists");
    }
  };

  // Remove keyword from the list
  const removeKeyword = (keywordToRemove: string) => {
    setKeywordsList(
      keywordsList.filter((keyword) => keyword !== keywordToRemove)
    );
  };

  // Add specifications state
  const [specifications, setSpecifications] = useState<
    Array<{ id: number; key: string; value: string }>
  >([]);
  const [nextSpecId, setNextSpecId] = useState<number>(1);
  const [newSpecKey, setNewSpecKey] = useState<string>("");
  const [newSpecValue, setNewSpecValue] = useState<string>("");

  // Add specification
  const addSpecification = () => {
    if (!newSpecKey || !newSpecValue) {
      toast.error("Both specification name and value are required");
      return;
    }

    const id = nextSpecId;
    setSpecifications([
      ...specifications,
      { id, key: newSpecKey, value: newSpecValue },
    ]);
    setNextSpecId(id + 1);
    setNewSpecKey("");
    setNewSpecValue("");
  };

  // Remove specification
  const removeSpecification = (idToRemove: number) => {
    setSpecifications(specifications.filter((spec) => spec.id !== idToRemove));
  };

  // Update specification
  const updateSpecification = (
    id: number,
    field: "key" | "value",
    value: string
  ) => {
    setSpecifications((prev) =>
      prev.map((spec) => (spec.id === id ? { ...spec, [field]: value } : spec))
    );
  };

  // Handle form submission - update to include new SEO fields and specifications
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate basic form data
    if (!productName) {
      toast.error("Product name is required");
      return;
    }

    if (!selectedCategory) {
      toast.error("Please select a category");
      return;
    }

    if (!basePrice) {
      toast.error("Base price is required");
      return;
    }

    // Collect form data
    const formData = {
      name: productName,
      category: selectedCategory,
      subcategory: selectedSubcategory,
      sku,
      basePrice: parseFloat(basePrice),
      priceTiers: sortedPriceTiers.map((tier) => ({
        minQuantity: parseInt(tier.minQuantity) || 0,
        price: parseFloat(tier.price) || 0,
      })),
      images: images.map((img) => ({
        id: img.id,
        name: img.file.name,
      })),
      variants: quantities,
      totalInventory: calculateTotalInventory(),
      active: isActive,
      // Add SEO data
      description: productDescription,
      keywords: keywordsList,
      meta: {
        title: metaTitle || productName, // Default to product name if not provided
        description: metaDescription,
      },
      // Add specifications
      specifications: specifications.reduce((acc, spec) => {
        acc[spec.key] = spec.value;
        return acc;
      }, {} as Record<string, string>),
    };

    console.log("Product data:", formData);
    toast.success("Product saved successfully!");
  };

  // Handle add new category
  const handleAddNewCategory = () => {
    if (!newCategoryName) {
      toast.error("Category name is required");
      return;
    }

    // Logic would typically connect to a backend here
    console.log("New category:", { name: newCategoryName, parentCategory });
    toast.success(`Category "${newCategoryName}" added successfully!`);
    setIsCategoryModalOpen(false);
    setNewCategoryName("");
    setParentCategory("");
  };

  // Handle add new subcategory
  const handleAddNewSubcategory = () => {
    if (!newSubcategoryName) {
      toast.error("Subcategory name is required");
      return;
    }

    if (!selectedCategory) {
      toast.error("Please select a parent category");
      return;
    }

    // Logic would typically connect to a backend here
    console.log("New subcategory:", {
      name: newSubcategoryName,
      parentCategory: selectedCategory,
    });
    toast.success(`Subcategory "${newSubcategoryName}" added successfully!`);
    setIsSubcategoryModalOpen(false);
    setNewSubcategoryName("");
  };

  const resetSizesAndColors = () => {
    if (
      window.confirm("Are you sure you want to clear all sizes and colors?")
    ) {
      setSizes([]);
      setColors([]);
      setQuantities({});
      toast.success("All sizes and colors have been cleared");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-12 ">
      {/* Basic Product Info Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Basic Product Information
          </CardTitle>
          <CardDescription>
            Enter the essential details about your product
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="productName" className="text-sm font-medium">
              Product Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Enter product name"
              className="w-full"
              required
            />
          </div>

          {/* Category and Subcategory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="category" className="text-sm font-medium">
                  Product Category <span className="text-red-500">*</span>
                </Label>
                <Dialog
                  open={isCategoryModalOpen}
                  onOpenChange={setIsCategoryModalOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <Plus className="h-3.5 w-3.5" />
                      <span className="text-xs">Add New</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Category</DialogTitle>
                      <DialogDescription>
                        Create a new category for your products.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="categoryName">Category Name</Label>
                        <Input
                          id="categoryName"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="Enter category name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="parentCategory">
                          Parent Category (Optional)
                        </Label>
                        <Select
                          value={parentCategory}
                          onValueChange={setParentCategory}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select parent category" />
                          </SelectTrigger>
                          <SelectContent>
                            {/* Fixed issue: Changed empty string value to "none" */}
                            <SelectItem value="none">
                              None (Top-level Category)
                            </SelectItem>
                            {categories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.name}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsCategoryModalOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleAddNewCategory}>
                        Save Category
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="">
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="subcategory" className="text-sm font-medium">
                  Subcategory
                </Label>
                <Dialog
                  open={isSubcategoryModalOpen}
                  onOpenChange={setIsSubcategoryModalOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1"
                      disabled={!selectedCategory}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span className="text-xs">Add New</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Subcategory</DialogTitle>
                      <DialogDescription>
                        Create a new subcategory under {selectedCategory}.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="subcategoryName">
                          Subcategory Name
                        </Label>
                        <Input
                          id="subcategoryName"
                          value={newSubcategoryName}
                          onChange={(e) =>
                            setNewSubcategoryName(e.target.value)
                          }
                          placeholder="Enter subcategory name"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsSubcategoryModalOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleAddNewSubcategory}>
                        Save Subcategory
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <Select
                value={selectedSubcategory}
                onValueChange={setSelectedSubcategory}
                disabled={!selectedCategory}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .find((cat) => cat.name === selectedCategory)
                    ?.subcategories.map((sub) => (
                      <SelectItem key={sub} value={sub}>
                        {sub}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* SKU */}
          <div className="space-y-2">
            <Label htmlFor="sku" className="text-sm font-medium">
              SKU (Stock Keeping Unit)
            </Label>
            <Input
              id="sku"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="Enter product SKU (optional)"
              className="w-full"
            />
          </div>

          {/* Dynamic Pricing Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium">Pricing Information</h3>
              <Button
                type="button"
                onClick={addPriceTier}
                variant="outline"
                size="sm"
                className="h-8 gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                <span className="text-xs">Add Price Tier</span>
              </Button>
            </div>

            <div className="space-y-3">
              {/* Base Price */}
              <div className="space-y-2">
                <Label htmlFor="basePrice" className="text-sm font-medium">
                  Base Price <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    id="basePrice"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="pl-7"
                    required
                  />
                </div>
              </div>

              {/* Price Tiers */}
              {sortedPriceTiers.map((tier) => (
                <div
                  key={tier.id}
                  className="grid grid-cols-12 gap-4 items-end"
                >
                  <div className="col-span-5 space-y-2">
                    <Label
                      htmlFor={`qty-${tier.id}`}
                      className="text-sm font-medium"
                    >
                      Min. Quantity
                    </Label>
                    <Input
                      id={`qty-${tier.id}`}
                      value={tier.minQuantity}
                      onChange={(e) =>
                        updatePriceTier(tier.id, "minQuantity", e.target.value)
                      }
                      type="number"
                      min="1"
                      placeholder="Minimum quantity"
                      className="w-full"
                    />
                  </div>

                  <div className="col-span-5 space-y-2">
                    <Label
                      htmlFor={`price-${tier.id}`}
                      className="text-sm font-medium"
                    >
                      Price Per Unit
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <Input
                        id={`price-${tier.id}`}
                        value={tier.price}
                        onChange={(e) =>
                          updatePriceTier(tier.id, "price", e.target.value)
                        }
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-7"
                      />
                    </div>
                  </div>

                  <div className="col-span-2 flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removePriceTier(tier.id)}
                      disabled={priceTiers.length <= 1}
                      className="h-10 w-10 text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-gray-100 rounded-md text-gray-600 text-sm">
              Bulk orders beyond your highest tier: Contact seller
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Description & SEO Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Product Details & SEO
          </CardTitle>
          <CardDescription>
            Add detailed information and SEO metadata to improve product
            visibility
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Product Description */}
          <div className="space-y-2">
            <Label htmlFor="productDescription" className="text-sm font-medium">
              Product Description
            </Label>
            <Textarea
              id="productDescription"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              placeholder="Provide a detailed description of the product"
              className="min-h-32"
            />
            <p className="text-xs text-muted-foreground">
              Clearly describe your product's features, materials, and benefits
              for customers
            </p>
          </div>

          {/* Keywords */}
          <div className="space-y-2">
            <Label htmlFor="keywords" className="text-sm font-medium">
              Keywords
            </Label>
            <div className="flex space-x-2">
              <Input
                id="keywords"
                value={currentKeyword}
                onChange={(e) => setCurrentKeyword(e.target.value)}
                placeholder="Enter keyword"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addKeyword();
                  }
                }}
              />
              <Button
                type="button"
                onClick={addKeyword}
                disabled={!currentKeyword}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Add relevant keywords to improve search visibility
            </p>

            {keywordsList.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {keywordsList.map((keyword) => (
                  <div
                    key={keyword}
                    className="bg-gray-100 px-2 py-1 rounded-md text-sm flex items-center"
                  >
                    <span className="mr-1">{keyword}</span>
                    <button
                      type="button"
                      onClick={() => removeKeyword(keyword)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator className="my-4" />

          {/* Meta Title */}
          <div className="space-y-2">
            <Label htmlFor="metaTitle" className="text-sm font-medium">
              Meta Title (SEO)
            </Label>
            <Input
              id="metaTitle"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="SEO-optimized title (defaults to product name if empty)"
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Characters: {metaTitle.length}/60 (Recommended: 50-60 characters)
            </p>
          </div>

          {/* Meta Description */}
          <div className="space-y-2">
            <Label htmlFor="metaDescription" className="text-sm font-medium">
              Meta Description (SEO)
            </Label>
            <Textarea
              id="metaDescription"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Brief description for search engine results"
              className="min-h-20"
            />
            <p className="text-xs text-muted-foreground">
              Characters: {metaDescription.length}/160 (Recommended: 150-160
              characters)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Product Images Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Product Images
          </CardTitle>
          <CardDescription>
            Upload high-quality images of your product
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="mb-4">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Drag and drop images here or click to upload
              </p>
              <p className="text-xs text-gray-500 mt-1">
                JPEG, PNG, GIF up to 5MB each
              </p>
            </div>

            <label htmlFor="file-upload" className="cursor-pointer">
              <Button variant="outline" className="mt-2" type="button">
                <Upload className="h-4 w-4 mr-2" />
                Upload Images
              </Button>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>

          {images.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-3">Preview</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {images.map((image) => (
                  <div key={image.id} className="relative group">
                    <div className="aspect-square rounded-md overflow-hidden border border-gray-200">
                      <img
                        src={image.preview}
                        alt={`Preview ${image.id}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 focus:outline-none"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Variant Quantity Matrix */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">
              Variants & Inventory
            </CardTitle>
            <CardDescription>
              Manage your product variations and stock quantities
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={resetSizesAndColors}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <Trash className="h-4 w-4 mr-2" />
            Reset All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Add new size/color controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newSize">Add New Size</Label>
                <div className="flex space-x-2">
                  <Input
                    id="newSize"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    placeholder="Enter size (e.g. XXL)"
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSize();
                      }
                    }}
                  />
                  <Button type="button" onClick={addSize} disabled={!newSize}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {sizes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {sizes.map((size) => (
                      <div
                        key={size}
                        className="bg-gray-100 px-2 py-1 rounded-md text-sm flex items-center"
                      >
                        <span className="mr-1">{size}</span>
                        <button
                          type="button"
                          onClick={() => removeSize(size)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newColor">Add New Color</Label>
                <div className="flex space-x-2">
                  <Input
                    id="newColor"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    placeholder="Enter color (e.g. Green)"
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addColor();
                      }
                    }}
                  />
                  <Button type="button" onClick={addColor} disabled={!newColor}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {colors.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {colors.map((color) => (
                      <div
                        key={color}
                        className="bg-gray-100 px-2 py-1 rounded-md text-sm flex items-center"
                      >
                        <span className="mr-1">{color}</span>
                        <button
                          type="button"
                          onClick={() => removeColor(color)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Variant Matrix */}
            {sizes.length > 0 && colors.length > 0 ? (
              <div className="overflow-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size / Color
                      </th>
                      {colors.map((color) => (
                        <th
                          key={color}
                          className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {color}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sizes.map((size, sizeIndex) => (
                      <tr key={size}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {size}
                        </td>
                        {colors.map((color) => (
                          <td
                            key={`${size}-${color}`}
                            className="px-4 py-3 whitespace-nowrap"
                          >
                            <Input
                              type="number"
                              min="0"
                              value={(quantities[size]?.[color] ?? 0) || ""}
                              onChange={(e) =>
                                updateQuantity(
                                  size,
                                  color,
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="w-20 h-9 text-center"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        Total Stock
                      </td>
                      <td
                        colSpan={colors.length}
                        className="px-4 py-3 text-right text-sm font-semibold"
                      >
                        {calculateTotalInventory()} units
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <div className="text-center p-8 border border-dashed rounded-lg bg-gray-50">
                <p className="text-gray-500">
                  Add at least one size and one color to create the variant
                  matrix
                </p>
              </div>
            )}

            {/* Active/Inactive Toggle */}
            <div className="flex items-center justify-between space-x-2 pt-4">
              <div className="space-y-0.5">
                <Label className="text-base">Product Visibility</Label>
                <p className="text-sm text-muted-foreground">
                  {isActive
                    ? "Product will be visible to customers"
                    : "Product will be hidden from customers"}
                </p>
              </div>
              <div className="flex items-center">
                <span
                  className={`mr-2 text-sm ${
                    !isActive ? "font-medium" : "text-muted-foreground"
                  }`}
                >
                  Inactive
                </span>
                <Switch checked={isActive} onCheckedChange={setIsActive} />
                <span
                  className={`ml-2 text-sm ${
                    isActive ? "font-medium" : "text-muted-foreground"
                  }`}
                >
                  Active
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Specifications Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Product Specifications
          </CardTitle>
          <CardDescription>
            Add technical details and specifications for your product
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="specKey">Specification Name</Label>
                <Input
                  id="specKey"
                  value={newSpecKey}
                  onChange={(e) => setNewSpecKey(e.target.value)}
                  placeholder="e.g. Material, Weight, Dimensions"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specValue">Specification Value</Label>
                <div className="flex space-x-2">
                  <Input
                    id="specValue"
                    value={newSpecValue}
                    onChange={(e) => setNewSpecValue(e.target.value)}
                    placeholder="e.g. Cotton, 500g, 10x20x30cm"
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSpecification();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={addSpecification}
                    disabled={!newSpecKey || !newSpecValue}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {specifications.length > 0 ? (
              <div className="mt-4">
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Specification
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Value
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {specifications.map((spec) => (
                        <tr key={spec.id}>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <Input
                              value={spec.key}
                              onChange={(e) =>
                                updateSpecification(
                                  spec.id,
                                  "key",
                                  e.target.value
                                )
                              }
                              className="border-0 focus-visible:ring-0 p-0 h-auto"
                            />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <Input
                              value={spec.value}
                              onChange={(e) =>
                                updateSpecification(
                                  spec.id,
                                  "value",
                                  e.target.value
                                )
                              }
                              className="border-0 focus-visible:ring-0 p-0 h-auto"
                            />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSpecification(spec.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 border border-dashed rounded-lg bg-gray-50">
                <p className="text-gray-500">No specifications added yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" size="lg" className="px-8">
          <Check className="mr-2 h-4 w-4" /> Save Product
        </Button>
      </div>
    </form>
  );
};

export default AddProduct2;
