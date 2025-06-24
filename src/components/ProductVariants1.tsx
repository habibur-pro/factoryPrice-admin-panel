/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, RefreshCcw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

type VariantMap = Record<string, string[]>;
type Combination = Record<string, string>;
interface ProductVariantsProps {
  variants: any[];
  setVariants: React.Dispatch<React.SetStateAction<any[]>>;
}
const availableVariants = ["Color", "Size"];

function generateCombinations(variantMap: VariantMap): Combination[] {
  const keys = Object.keys(variantMap);
  if (keys.length === 0) return [];

  const cartesian = (arr: string[][]): string[][] => {
    //@ts-ignore
    return arr.reduce(
      //@ts-ignore
      (a, b) => a.flatMap((d) => b.map((e) => [...d, e])),
      [[]]
    );
  };

  const values = keys.map((k) => variantMap[k]);
  const combos = cartesian(values);
  return combos.map((combo) => {
    const entry: Combination = {};
    combo.forEach((v, i) => (entry[keys[i]] = v));
    return entry;
  });
}

const ProductVariants = ({ variants, setVariants }: ProductVariantsProps) => {
  const [isVariantModalOpen, setVariantModalOpen] = useState(false);
  const [newVariant, setNewVariant] = useState("");
  const [variantNames, setVariantNames] = useState<string[]>([]);
  const [variantOptions, setVariantOptions] = useState<VariantMap>({});
  const [newOptions, setNewOptions] = useState<Record<string, string>>({});
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [combinations, setCombinations] = useState<
    (Combination & { stock: number; price: number; active: boolean })[]
  >([]);

  const addVariant = (variant: string) => {
    if (!variant || variantNames.includes(variant)) return;
    setVariantNames([...variantNames, variant]);
    setVariantOptions((prev) => ({ ...prev, [variant]: [] }));
    setSelectedVariant("");
  };

  const addOption = (variant: string) => {
    const val = newOptions[variant]?.trim();
    if (!val || variantOptions[variant]?.includes(val)) return;

    const updated = { ...variantOptions };
    updated[variant] = [...(updated[variant] || []), val];
    setVariantOptions(updated);
    setNewOptions({ ...newOptions, [variant]: "" });
  };

  const regenerateCombinations = (map: VariantMap) => {
    const combos = generateCombinations(map);
    const withMeta = combos.map((c) => {
      const existing = combinations.find((combo) =>
        Object.entries(c).every(([key, val]) => combo[key] === val)
      );
      return {
        ...c,
        stock: existing?.stock ?? 0,
        price: existing?.price ?? 0,
        active: existing?.active ?? true,
      };
    });
    //@ts-ignore
    setCombinations(withMeta);
  };

  useEffect(() => {
    regenerateCombinations(variantOptions);
  }, [variantOptions]);
  useEffect(() => {
    setVariants(combinations);
  }, [combinations]);
  const resetVariants = () => {
    setVariantNames([]);
    setVariantOptions({});
    setNewOptions({});
    setSelectedVariant("");
    setCombinations([]);
  };
  const handleAddVariant = () => {
    if (availableVariants.includes(newVariant)) {
      toast.error("already exist!");
      return;
    }
    availableVariants.push(newVariant);
    setVariantModalOpen(false);
  };
  const removeVariant = (variant: string) => {
    const updatedNames = variantNames.filter((v) => v !== variant);
    const updatedOptions = { ...variantOptions };
    delete updatedOptions[variant];
    const updatedNewOptions = { ...newOptions };
    delete updatedNewOptions[variant];

    setVariantNames(updatedNames);
    setVariantOptions(updatedOptions);
    setNewOptions(updatedNewOptions);
  };
  const removeOption = (variant: string, option: string) => {
    const updated = { ...variantOptions };
    updated[variant] = updated[variant].filter((opt) => opt !== option);
    setVariantOptions(updated);
  };
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={resetVariants}
          className="flex items-center gap-1 text-destructive"
        >
          <RefreshCcw className="h-4 w-4" />
          Reset All
        </Button>
      </div>
      <div className="flex space-x-2">
        <Select
          value={selectedVariant}
          onValueChange={(val) => addVariant(val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Variant Type" />
          </SelectTrigger>
          <SelectContent>
            {availableVariants.map((variant) => (
              <SelectItem key={variant} value={variant}>
                {variant}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Dialog open={isVariantModalOpen} onOpenChange={setVariantModalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Variant</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="variant-name">Variant Name</Label>
                <Input
                  id="variant-name"
                  placeholder="Enter variant name"
                  value={newVariant}
                  onChange={(e) => setNewVariant(e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setVariantModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddVariant}>Add variant</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {variantNames.map((variant) => (
        <div key={variant} className="space-y-2 border p-3 rounded-md">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">{variant}</h2>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive"
              onClick={() => removeVariant(variant)}
            >
              ✕
            </Button>
          </div>
          <div className="flex space-x-2">
            <Input
              placeholder={`Add option for ${variant}`}
              value={newOptions[variant] || ""}
              onChange={(e) =>
                setNewOptions({ ...newOptions, [variant]: e.target.value })
              }
            />
            <Button type="button" onClick={() => addOption(variant)}>
              Add Option
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(variantOptions[variant] || []).map((opt) => (
              <span
                key={opt}
                className="px-2 py-1 rounded bg-gray-100 flex items-center gap-1"
              >
                {opt}
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => removeOption(variant, opt)}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>
      ))}

      {combinations.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Variant Combinations</h2>
          {combinations.map((combo, idx) => (
            <Card key={idx} className="border p-4">
              <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {variantNames.map((v) => (
                    <span key={v} className="text-sm font-medium">
                      {v}: {combo[v]}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4 w-full">
                  <div>
                    <Label className="text-muted-foreground text-sm mb-1 font-sans font-normal">
                      Quantity
                    </Label>
                    <Input
                      type="number"
                      placeholder="Stock"
                      value={combo.stock}
                      onChange={(e) => {
                        const copy = [...combinations];
                        copy[idx].stock = parseInt(e.target.value) || 0;
                        setCombinations(copy);
                      }}
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm mb-1 font-sans font-normal">
                      Adjustment Price
                    </Label>
                    <Input
                      type="number"
                      placeholder="Price"
                      value={combo.price}
                      onChange={(e) => {
                        const copy = [...combinations];
                        copy[idx].price = parseFloat(e.target.value) || 0;
                        setCombinations(copy);
                      }}
                    />
                  </div>
                  <label className="flex items-center gap-2">
                    <Checkbox
                      checked={combo.active}
                      onCheckedChange={(checked) => {
                        const copy = [...combinations];
                        copy[idx].active = !!checked;
                        setCombinations(copy);
                      }}
                    />
                    Active
                  </label>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductVariants;
