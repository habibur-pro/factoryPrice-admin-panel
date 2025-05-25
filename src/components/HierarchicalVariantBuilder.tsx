import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, RefreshCcw, X } from "lucide-react";
import { toast } from "sonner";

// Updated VariantCombination type to match the required structure
interface VariantCombination {
  id: string;
  group: string;
  label: string;
  value: string;
  stock: number;
}

interface HierarchicalVariantBuilderProps {
  variantTypes: any[];
  variants: VariantCombination[];
  setVariants: React.Dispatch<React.SetStateAction<VariantCombination[]>>;
}

type VariantMap = Record<string, string[]>;

// Predefined variant group options
const VARIANT_GROUP_OPTIONS = [
  "Color",
  "Size",
  "Material",
  "Style",
  "Weight",
  "Length",
  "Width",
  "Pattern",
  "Finish",
  "Type",
];

const HierarchicalVariantBuilder = ({
  variants,
  setVariants,
}: HierarchicalVariantBuilderProps) => {
  // State management
  const [selectedVariantGroup, setSelectedVariantGroup] = useState("");
  const [activeVariantNames, setActiveVariantNames] = useState<string[]>([]);
  const [variantOptions, setVariantOptions] = useState<VariantMap>({});
  const [newOptions, setNewOptions] = useState<Record<string, string>>({});

  /**
   * Add a new variant group from dropdown
   */
  const addVariantGroup = (variantName: string) => {
    if (!variantName || activeVariantNames.includes(variantName)) {
      if (activeVariantNames.includes(variantName)) {
        toast.error("Variant group already exists!");
      }
      return;
    }

    setActiveVariantNames([...activeVariantNames, variantName]);
    setVariantOptions((prev) => ({ ...prev, [variantName]: [] }));
    setSelectedVariantGroup("");
  };

  /**
   * Add an option to a variant group and create a variant combination
   */
  const addOption = (variantName: string) => {
    const value = newOptions[variantName]?.trim();
    if (!value) {
      toast.error("Please enter an option value!");
      return;
    }

    if (variantOptions[variantName]?.includes(value)) {
      toast.error("Option already exists!");
      return;
    }

    const updated = { ...variantOptions };
    updated[variantName] = [...(updated[variantName] || []), value];
    setVariantOptions(updated);
    setNewOptions({ ...newOptions, [variantName]: "" });

    // Create a new variant combination for this option
    const newVariant: VariantCombination = {
      id: `variant-${Date.now()}-${Math.random()}`,
      group: variantName,
      label: value,
      value: value.toLowerCase().replace(/\s+/g, "-"),
      stock: 0,
    };

    setVariants((prev) => [...prev, newVariant]);
  };

  /**
   * Remove a variant group and all its combinations
   */
  const removeVariantGroup = (variantName: string) => {
    const updatedNames = activeVariantNames.filter((v) => v !== variantName);
    const updatedOptions = { ...variantOptions };
    delete updatedOptions[variantName];
    const updatedNewOptions = { ...newOptions };
    delete updatedNewOptions[variantName];

    // Remove all variants for this group
    setVariants((prev) =>
      prev.filter((variant) => variant.group !== variantName)
    );

    setActiveVariantNames(updatedNames);
    setVariantOptions(updatedOptions);
    setNewOptions(updatedNewOptions);
    toast.success(`${variantName} variant group removed!`);
  };

  /**
   * Remove an option from a variant group
   */
  const removeOption = (variantName: string, option: string) => {
    const updated = { ...variantOptions };
    updated[variantName] = updated[variantName].filter((opt) => opt !== option);
    setVariantOptions(updated);

    // Remove the corresponding variant
    setVariants((prev) =>
      prev.filter(
        (variant) =>
          !(variant.group === variantName && variant.label === option)
      )
    );

    toast.success(`${option} removed from ${variantName}!`);
  };

  /**
   * Update a specific field of a variant
   */
  const updateVariant = (id: string, field: string, value: any) => {
    setVariants((prevVariants) =>
      prevVariants.map((variant) =>
        variant.id === id ? { ...variant, [field]: value } : variant
      )
    );
  };

  /**
   * Remove a variant combination
   */
  const removeVariantCombination = (id: string) => {
    const variantToRemove = variants.find((v) => v.id === id);
    if (variantToRemove) {
      // Remove from variantOptions as well
      const updated = { ...variantOptions };
      updated[variantToRemove.group] = updated[variantToRemove.group].filter(
        (opt) => opt !== variantToRemove.label
      );
      setVariantOptions(updated);
    }

    setVariants((prevVariants) =>
      prevVariants.filter((variant) => variant.id !== id)
    );
    toast.success("Variant combination removed!");
  };

  /**
   * Reset all variants and variant groups
   */
  const resetAllVariants = () => {
    setActiveVariantNames([]);
    setVariantOptions({});
    setNewOptions({});
    setSelectedVariantGroup("");
    setVariants([]);
    toast.success("All variants reset!");
  };

  // Get available options for the select (exclude already added ones)
  const availableOptions = VARIANT_GROUP_OPTIONS.filter(
    (option) => !activeVariantNames.includes(option)
  );

  return (
    <div className="space-y-6">
      {/* Header with Reset Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Product Variants</h3>
          <p className="text-sm text-muted-foreground">
            Create variant groups and combinations with individual stock
            quantities
          </p>
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

      {/* Add Variant Group - Select Dropdown */}
      <div className="flex space-x-2">
        <Select
          value={selectedVariantGroup}
          onValueChange={(value) => {
            setSelectedVariantGroup(value);
            addVariantGroup(value);
          }}
        >
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select variant group to add (e.g., Color, Size)" />
          </SelectTrigger>
          <SelectContent>
            {availableOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Active Variant Groups */}
      {activeVariantNames.map((variantName) => (
        <Card key={variantName} className="border">
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-md font-medium">{variantName}</h4>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive h-8 w-8 p-0"
                onClick={() => removeVariantGroup(variantName)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Add Option Input */}
            <div className="flex space-x-2">
              <Input
                placeholder={`Add option for ${variantName}`}
                value={newOptions[variantName] || ""}
                onChange={(e) =>
                  setNewOptions({
                    ...newOptions,
                    [variantName]: e.target.value,
                  })
                }
                onKeyDown={(e) => e.key === "Enter" && addOption(variantName)}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={() => addOption(variantName)}
                disabled={!newOptions[variantName]?.trim()}
              >
                Add Option
              </Button>
            </div>

            {/* Display Options */}
            <div className="flex flex-wrap gap-2">
              {(variantOptions[variantName] || []).map((option) => (
                <span
                  key={option}
                  className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground flex items-center gap-2 text-sm"
                >
                  {option}
                  <button
                    className="text-destructive hover:text-destructive/80 ml-1"
                    onClick={() => removeOption(variantName, option)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Variant Combinations Table - Shows Live */}
      {variants.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-medium">
              Variant Combinations ({variants.length})
            </h4>
          </div>

          <div className="space-y-3">
            {variants.map((variant) => (
              <Card key={variant.id} className="border">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    {/* Variant Display */}
                    <div className="md:col-span-2">
                      <div className="font-medium text-sm">
                        {variant.group}: {variant.label}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Value: {variant.value}
                      </div>
                    </div>

                    {/* Stock Input */}
                    <div className="md:col-span-1">
                      <Label className="text-xs text-muted-foreground mb-1 block">
                        Stock Quantity
                      </Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={variant.stock}
                        onChange={(e) =>
                          updateVariant(
                            variant.id,
                            "stock",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full"
                      />
                    </div>

                    {/* Remove Button */}
                    <div className="md:col-span-1 flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVariantCombination(variant.id)}
                        className="text-destructive h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6 p-4 bg-secondary/20 rounded-lg">
            <h5 className="font-medium mb-2">Summary</h5>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total Variants:</span>
                <span className="font-medium ml-2">{variants.length}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Total Stock:</span>
                <span className="font-medium ml-2">
                  {variants.reduce((sum, v) => sum + (v.stock || 0), 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HierarchicalVariantBuilder;
