import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface PricingSectionProps {
  singlePrice: string;
  bulkPrice: string;
  onSinglePriceChange: (value: string) => void;
  onBulkPriceChange: (value: string) => void;
  errors: {
    single: string;
    bulk: string;
  };
}

const PricingSection: React.FC<PricingSectionProps> = ({
  singlePrice,
  bulkPrice,
  onSinglePriceChange,
  onBulkPriceChange,
  errors,
}) => {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="pricing"
      className="w-full"
    >
      <AccordionItem value="pricing">
        <AccordionTrigger className="text-base font-medium">
          Tiered Pricing Options
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="singlePrice" className="text-sm font-medium">
                1 piece price (fixed) <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <Input
                  id="singlePrice"
                  type="text"
                  value={singlePrice}
                  onChange={(e) => onSinglePriceChange(e.target.value)}
                  className={`pl-7 ${errors.single ? "border-red-500" : ""}`}
                  placeholder="0.00"
                />
              </div>
              {errors.single && (
                <p className="text-red-500 text-xs">{errors.single}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bulkPrice" className="text-sm font-medium">
                1-50 pieces price (discounted){" "}
                <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <Input
                  id="bulkPrice"
                  type="text"
                  value={bulkPrice}
                  onChange={(e) => onBulkPriceChange(e.target.value)}
                  className={`pl-7 ${errors.bulk ? "border-red-500" : ""}`}
                  placeholder="0.00"
                />
              </div>
              {errors.bulk && (
                <p className="text-red-500 text-xs">{errors.bulk}</p>
              )}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">51-100 pieces:</span>
                <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  Contact seller
                </span>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">100+ pieces:</span>
                <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  Contact seller
                </span>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
export default PricingSection;
