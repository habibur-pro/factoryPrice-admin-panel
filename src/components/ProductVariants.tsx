
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Palette, Ruler, Plus, X, RefreshCcw } from "lucide-react";

interface ProductVariantsProps {
  variants: any[];
  setVariants: React.Dispatch<React.SetStateAction<any[]>>;
}

const ProductVariants = ({ variants, setVariants }: ProductVariantsProps) => {
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [newColor, setNewColor] = useState('');
  const [newSize, setNewSize] = useState('');
  const [variantType, setVariantType] = useState<'both' | 'color' | 'size'>('both');
  
  const addColor = () => {
    if (newColor && !colors.includes(newColor)) {
      setColors([...colors, newColor]);
      setNewColor('');
      generateVariants([...colors, newColor], sizes, variantType);
    }
  };

  const addSize = () => {
    if (newSize && !sizes.includes(newSize)) {
      setSizes([...sizes, newSize]);
      setNewSize('');
      generateVariants(colors, [...sizes, newSize], variantType);
    }
  };

  const removeColor = (index: number) => {
    const updatedColors = colors.filter((_, i) => i !== index);
    setColors(updatedColors);
    generateVariants(updatedColors, sizes, variantType);
  };

  const removeSize = (index: number) => {
    const updatedSizes = sizes.filter((_, i) => i !== index);
    setSizes(updatedSizes);
    generateVariants(colors, updatedSizes, variantType);
  };

  const resetAllVariants = () => {
    setColors([]);
    setSizes([]);
    setVariants([]);
    setNewColor('');
    setNewSize('');
  };

  const generateVariants = (colorList: string[], sizeList: string[], type: 'both' | 'color' | 'size' = 'both') => {
    if ((type === 'both' && colorList.length === 0 && sizeList.length === 0) ||
        (type === 'color' && colorList.length === 0) ||
        (type === 'size' && sizeList.length === 0)) {
      setVariants([]);
      return;
    }

    const newVariants: any[] = [];
    
    if (type === 'both') {
      if (colorList.length === 0 && sizeList.length > 0) {
        // Only sizes
        sizeList.forEach((size) => {
          newVariants.push({
            id: `variant-size-${size}`,
            name: `Size: ${size}`,
            size,
            price: 0,
            stock: 0,
          });
        });
      } else if (sizeList.length === 0 && colorList.length > 0) {
        // Only colors
        colorList.forEach((color) => {
          newVariants.push({
            id: `variant-color-${color}`,
            name: `Color: ${color}`,
            color,
            price: 0,
            stock: 0,
          });
        });
      } else if (colorList.length > 0 && sizeList.length > 0) {
        // Both colors and sizes
        colorList.forEach((color) => {
          sizeList.forEach((size) => {
            newVariants.push({
              id: `variant-${color}-${size}`,
              name: `${color} / ${size}`,
              color,
              size,
              price: 0,
              stock: 0,
            });
          });
        });
      }
    } else if (type === 'color') {
      // Only colors, regardless of sizes
      colorList.forEach((color) => {
        newVariants.push({
          id: `variant-color-${color}`,
          name: `Color: ${color}`,
          color,
          price: 0,
          stock: 0,
        });
      });
    } else if (type === 'size') {
      // Only sizes, regardless of colors
      sizeList.forEach((size) => {
        newVariants.push({
          id: `variant-size-${size}`,
          name: `Size: ${size}`,
          size,
          price: 0,
          stock: 0,
        });
      });
    }
    
    setVariants(newVariants);
  };

  const updateVariant = (id: string, field: string, value: any) => {
    setVariants(
      variants.map((variant) =>
        variant.id === id ? { ...variant, [field]: value } : variant
      )
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-start space-x-2">
          <div>
            <h3 className="text-md font-medium">Variant Type</h3>
            <p className="text-sm text-muted-foreground">Choose how variants will be generated</p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={resetAllVariants}
          className="flex items-center gap-1 text-destructive"
        >
          <RefreshCcw className="h-4 w-4" />
          Reset All
        </Button>
      </div>

      <Select 
        value={variantType} 
        onValueChange={(value) => {
          setVariantType(value as 'both' | 'color' | 'size');
          generateVariants(colors, sizes, value as 'both' | 'color' | 'size');
        }}
      >
        <SelectTrigger className="w-full md:w-[300px]">
          <SelectValue placeholder="Select variant type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="both">Color & Size Matrix (Both)</SelectItem>
          <SelectItem value="color">Color Variants Only</SelectItem>
          <SelectItem value="size">Size Variants Only</SelectItem>
        </SelectContent>
      </Select>

      <div className={`space-y-6 ${variantType === 'size' ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="flex items-start space-x-2">
          <Palette className="h-5 w-5 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-md font-medium">Color Variants</h3>
            <p className="text-sm text-muted-foreground">Add different color options for your product</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {colors.map((color, index) => (
            <div 
              key={index}
              className="flex items-center bg-secondary/50 px-3 py-1 rounded-full text-sm"
            >
              <span>{color}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 ml-1"
                onClick={() => removeColor(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Input
            placeholder="Add color variant (e.g., Red, Blue, Green)"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            className="flex-1"
          />
          <Button type="button" onClick={addColor} disabled={!newColor.trim()}>
            Add Color
          </Button>
        </div>
      </div>

      <div className={`space-y-6 ${variantType === 'color' ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="flex items-start space-x-2">
          <Ruler className="h-5 w-5 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-md font-medium">Size Variants</h3>
            <p className="text-sm text-muted-foreground">Add different size options for your product</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {sizes.map((size, index) => (
            <div 
              key={index}
              className="flex items-center bg-secondary/50 px-3 py-1 rounded-full text-sm"
            >
              <span>{size}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 ml-1"
                onClick={() => removeSize(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Input
            placeholder="Add size variant (e.g., S, M, L, XL)"
            value={newSize}
            onChange={(e) => setNewSize(e.target.value)}
            className="flex-1"
          />
          <Button type="button" onClick={addSize} disabled={!newSize.trim()}>
            Add Size
          </Button>
        </div>
      </div>

      {variants.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-md font-medium">Generated Variants ({variants.length})</h3>
          
          <div className="border rounded-lg overflow-hidden">
            <div className="grid grid-cols-5 gap-2 p-3 bg-secondary/30 text-sm font-medium">
              <div className="col-span-2">Variant</div>
              <div>Price Adjustment</div>
              <div>Stock</div>
              <div>Active</div>
            </div>
            <div className="divide-y">
              {variants.map((variant) => (
                <div key={variant.id} className="grid grid-cols-5 gap-2 p-3 items-center">
                  <div className="col-span-2">
                    {variant.name}
                  </div>
                  <div>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={variant.price}
                      onChange={(e) => updateVariant(variant.id, 'price', parseFloat(e.target.value) || 0)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Input
                      type="number"
                      placeholder="0"
                      value={variant.stock}
                      onChange={(e) => updateVariant(variant.id, 'stock', parseInt(e.target.value) || 0)}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-center">
                    <Checkbox
                      checked={variant.active !== false}
                      onCheckedChange={(checked) => updateVariant(variant.id, 'active', checked)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button type="button" variant="outline" className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  Manage All Variants
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Manage Product Variants</DialogTitle>
                  <DialogDescription>
                    Edit all variants in bulk or individually. Changes will be applied when you save.
                  </DialogDescription>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto">
                  <div className="space-y-4">
                    {variants.map((variant) => (
                      <div key={variant.id} className="border rounded-lg p-4">
                        <div className="font-medium mb-2">{variant.name}</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`price-${variant.id}`}>Price</Label>
                            <Input
                              id={`price-${variant.id}`}
                              type="number"
                              placeholder="0.00"
                              value={variant.price}
                              onChange={(e) => updateVariant(variant.id, 'price', parseFloat(e.target.value) || 0)}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`stock-${variant.id}`}>Stock</Label>
                            <Input
                              id={`stock-${variant.id}`}
                              type="number"
                              placeholder="0"
                              value={variant.stock}
                              onChange={(e) => updateVariant(variant.id, 'stock', parseInt(e.target.value) || 0)}
                            />
                          </div>
                        </div>
                        <div className="flex items-center mt-4 space-x-2">
                          <Checkbox
                            id={`active-${variant.id}`}
                            checked={variant.active !== false}
                            onCheckedChange={(checked) => updateVariant(variant.id, 'active', checked)}
                          />
                          <Label htmlFor={`active-${variant.id}`}>Active</Label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductVariants;
