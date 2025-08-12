import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Percent } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";

const PromotionsSection = () => {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      {/* Discount Value */}
      <FormField
        control={control}
        name="discountValue"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Discount Percentage</FormLabel>
            <FormControl>
              <div className="flex items-center mt-1">
                <Input
                  type="number"
                  placeholder="10"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
                <span className="ml-2">%</span>
              </div>
            </FormControl>
          </FormItem>
        )}
      />

      {/* Discount Period */}
      <div className="pt-2">
        <div className="flex items-start space-x-2">
          <Calendar className="h-5 w-5 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-md font-medium">Discount Period</h3>
            <p className="text-sm text-muted-foreground">
              Set when this discount starts and ends
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Start Date */}
          <FormField
            control={control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* End Date */}
          <FormField
            control={control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default PromotionsSection;





// import { useState } from 'react';
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import {
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel
// } from "@/components/ui/form";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useFormContext } from 'react-hook-form';
// import { Percent, Calendar } from 'lucide-react';

// const PromotionsSection = () => {
//   const { control } = useFormContext();
//   const [discountValue, setDiscountValue] = useState<string>('');
//   const [promoStartDate, setPromoStartDate] = useState<string>('');
//   const [promoEndDate, setPromoEndDate] = useState<string>('');

//   console.log("discount value",discountValue);
//   console.log("promo start date",promoStartDate)
//   console.log("promo end date",promoEndDate)

//   return (
//     <div className="space-y-6">

//       <div className="space-y-4">
//         <div>
//           <Label htmlFor="discount-value">
//             Discount Percentage
//           </Label>
//           <div className="flex items-center mt-1">
//             <Input
//               id="discount-value"
//               type="number"
//               placeholder="10"
//               value={discountValue}
//               onChange={(e) => setDiscountValue(e.target.value)}
//             />
//             <span className="ml-2">%</span>
//           </div>
//         </div>
//       </div>

//       <div className="pt-2">
//         <div className="flex items-start space-x-2">
//           <Calendar className="h-5 w-5 mt-1 flex-shrink-0" />
//           <div>
//             <h3 className="text-md font-medium">Discount Period</h3>
//             <p className="text-sm text-muted-foreground">
//               Set when this discount starts and ends
//             </p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//           <div>
//             <Label htmlFor="promo-start">Start Date</Label>
//             <Input
//               id="promo-start"
//               type="date"
//               value={promoStartDate}
//               onChange={(e) => setPromoStartDate(e.target.value)}
//               className="mt-1"
//             />
//           </div>
//           <div>
//             <Label htmlFor="promo-end">End Date</Label>
//             <Input
//               id="promo-end"
//               type="date"
//               value={promoEndDate}
//               onChange={(e) => setPromoEndDate(e.target.value)}
//               className="mt-1"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PromotionsSection;
