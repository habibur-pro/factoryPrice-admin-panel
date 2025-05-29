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
import { X } from "lucide-react";
import { toast } from "sonner";

interface VariantGroup {
  name: string;
  values: string[];
}

interface VariantCombination {
  name: string;
  value: string;
}

interface Variant {
  combination: VariantCombination[];
  stockQuantity: number;
}

interface VariantData {
  variantGroups: VariantGroup[];
  variants: Variant[];
}

interface HierarchicalVariantBuilderProps {
  variants: VariantData;
  setVariants: React.Dispatch<React.SetStateAction<VariantData>>;
}

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
  const [selectedVariantGroup, setSelectedVariantGroup] = useState("");
  const [newOptions, setNewOptions] = useState<Record<string, string>>({});

  // Generate all possible combinations
  const generateAllCombinations = (
    groups: VariantGroup[]
  ): VariantCombination[][] => {
    if (groups.length === 0) return [];
    if (groups.length === 1) {
      return groups[0].values.map((value) => [{ name: groups[0].name, value }]);
    }

    const [firstGroup, ...restGroups] = groups;
    const restCombinations = generateAllCombinations(restGroups);

    const allCombinations: VariantCombination[][] = [];

    for (const value of firstGroup.values) {
      for (const restCombination of restCombinations) {
        allCombinations.push([
          { name: firstGroup.name, value },
          ...restCombination,
        ]);
      }
    }

    return allCombinations;
  };

  // Update variants when variant groups change
  useEffect(() => {
    if (variants.variantGroups.length === 0) {
      setVariants((prev) => ({ ...prev, variants: [] }));
      return;
    }

    const allCombinations = generateAllCombinations(variants.variantGroups);
    const newVariants: Variant[] = allCombinations.map((combination) => {
      // Check if this combination already exists
      const existingVariant = variants.variants.find(
        (v) =>
          v.combination.length === combination.length &&
          v.combination.every((c) =>
            combination.some((nc) => nc.name === c.name && nc.value === c.value)
          )
      );

      return {
        combination,
        stockQuantity: existingVariant ? existingVariant.stockQuantity : 0,
      };
    });

    setVariants((prev) => ({ ...prev, variants: newVariants }));
  }, [variants.variantGroups]);

  /**
   * Add a new variant group from dropdown
   */
  const addVariantGroup = (variantName: string) => {
    if (
      !variantName ||
      variants.variantGroups.some((g) => g.name === variantName)
    ) {
      if (variants.variantGroups.some((g) => g.name === variantName)) {
        toast.error("Variant group already exists!");
      }
      return;
    }

    setVariants((prev) => ({
      ...prev,
      variantGroups: [...prev.variantGroups, { name: variantName, values: [] }],
    }));
    setSelectedVariantGroup("");
    toast.success(`${variantName} variant group added!`);
  };

  /**
   * Add an option to a variant group
   */
  const addOption = (variantName: string) => {
    const value = newOptions[variantName]?.trim();
    if (!value) {
      toast.error("Please enter an option value!");
      return;
    }

    const group = variants.variantGroups.find((g) => g.name === variantName);
    if (group?.values.includes(value)) {
      toast.error("Option already exists!");
      return;
    }

    setVariants((prev) => ({
      ...prev,
      variantGroups: prev.variantGroups.map((g) =>
        g.name === variantName ? { ...g, values: [...g.values, value] } : g
      ),
    }));

    setNewOptions({ ...newOptions, [variantName]: "" });
    toast.success(`${value} added to ${variantName}!`);
  };

  /**
   * Remove a variant group
   */
  const removeVariantGroup = (variantName: string) => {
    setVariants((prev) => ({
      ...prev,
      variantGroups: prev.variantGroups.filter((g) => g.name !== variantName),
    }));

    const updatedNewOptions = { ...newOptions };
    delete updatedNewOptions[variantName];
    setNewOptions(updatedNewOptions);

    toast.success(`${variantName} variant group removed!`);
  };

  /**
   * Remove an option from a variant group
   */
  const removeOption = (variantName: string, option: string) => {
    setVariants((prev) => ({
      ...prev,
      variantGroups: prev.variantGroups.map((g) =>
        g.name === variantName
          ? { ...g, values: g.values.filter((v) => v !== option) }
          : g
      ),
    }));

    toast.success(`${option} removed from ${variantName}!`);
  };

  /**
   * Update stock quantity for a variant
   */
  const updateVariantStock = (
    combinationIndex: number,
    stockQuantity: number
  ) => {
    setVariants((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, index) =>
        index === combinationIndex ? { ...variant, stockQuantity } : variant
      ),
    }));
  };

  /**
   * Reset all variants and variant groups
   */
  // const resetAllVariants = () => {
  //   setVariants({ variantGroups: [], variants: [] });
  //   setNewOptions({});
  //   setSelectedVariantGroup("");
  //   toast.success("All variants reset!");
  // };

  // Get available options for the select (exclude already added ones)
  const availableOptions = VARIANT_GROUP_OPTIONS.filter(
    (option) => !variants.variantGroups.some((g) => g.name === option)
  );

  return (
    <div className="space-y-6">
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
      {variants.variantGroups.map((group) => (
        <Card key={group.name} className="border">
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-md font-medium">{group.name}</h4>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive h-8 w-8 p-0"
                onClick={() => removeVariantGroup(group.name)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Add Option Input */}
            <div className="flex space-x-2">
              <Input
                placeholder={`Add option for ${group.name}`}
                value={newOptions[group.name] || ""}
                onChange={(e) =>
                  setNewOptions({ ...newOptions, [group.name]: e.target.value })
                }
                onKeyDown={(e) => e.key === "Enter" && addOption(group.name)}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={() => addOption(group.name)}
                disabled={!newOptions[group.name]?.trim()}
              >
                Add Option
              </Button>
            </div>

            {/* Display Options */}
            <div className="flex flex-wrap gap-2">
              {group.values.map((option) => (
                <span
                  key={option}
                  className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground flex items-center gap-2 text-sm"
                >
                  {option}
                  <button
                    className="text-destructive hover:text-destructive/80 ml-1"
                    onClick={() => removeOption(group.name, option)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Variant Combinations Table */}
      {variants.variants.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-medium">
              Variant Combinations ({variants.variants.length})
            </h4>
          </div>

          <div className="space-y-3">
            {variants.variants.map((variant, index) => (
              <Card key={index} className="border">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    {/* Variant Display */}
                    <div className="md:col-span-2">
                      <div className="font-medium text-sm">
                        {variant.combination
                          .map((c) => `${c.name}: ${c.value}`)
                          .join(", ")}
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
                        value={variant.stockQuantity}
                        onChange={(e) =>
                          updateVariantStock(
                            index,
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full"
                      />
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
                <span className="font-medium ml-2">
                  {variants.variants.length}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Total Stock:</span>
                <span className="font-medium ml-2">
                  {variants.variants.reduce(
                    (sum, v) => sum + (v.stockQuantity || 0),
                    0
                  )}
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
