
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel 
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormContext } from 'react-hook-form';
import { Percent, Calendar } from 'lucide-react';

const PromotionsSection = () => {
  const { control } = useFormContext();
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<string>('');
  const [freeShipping, setFreeShipping] = useState<boolean>(false);
  const [promoStartDate, setPromoStartDate] = useState<string>('');
  const [promoEndDate, setPromoEndDate] = useState<string>('');

  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-2">
        <Percent className="h-5 w-5 mt-1 flex-shrink-0" />
        <div>
          <h3 className="text-md font-medium">Discount Settings</h3>
          <p className="text-sm text-muted-foreground">
            Set special prices and discounts for this product
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Discount Type</Label>
          <RadioGroup
            value={discountType}
            onValueChange={(value) => setDiscountType(value as 'percentage' | 'fixed')}
            className="flex space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="percentage" id="percentage" />
              <Label htmlFor="percentage">Percentage (%)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fixed" id="fixed" />
              <Label htmlFor="fixed">Fixed Amount</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="discount-value">
            {discountType === 'percentage' ? 'Discount Percentage' : 'Discount Amount'}
          </Label>
          <div className="flex items-center mt-1">
            <Input
              id="discount-value"
              type="number"
              placeholder={discountType === 'percentage' ? '10' : '5.99'}
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
            />
            <span className="ml-2">{discountType === 'percentage' ? '%' : '$'}</span>
          </div>
        </div>
      </div>

      <div className="pt-6">
        <div className="flex items-start space-x-2">
          <Calendar className="h-5 w-5 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-md font-medium">Promotional Period</h3>
            <p className="text-sm text-muted-foreground">
              Set when this promotion starts and ends
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="promo-start">Start Date</Label>
            <Input
              id="promo-start"
              type="date"
              value={promoStartDate}
              onChange={(e) => setPromoStartDate(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="promo-end">End Date</Label>
            <Input
              id="promo-end"
              type="date"
              value={promoEndDate}
              onChange={(e) => setPromoEndDate(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <div className="pt-6">
        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
          <FormControl>
            <Checkbox
              checked={freeShipping}
              onCheckedChange={(checked) => setFreeShipping(checked === true)}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>
              Free Shipping
            </FormLabel>
            <p className="text-sm text-muted-foreground">
              Offer free shipping for this product
            </p>
          </div>
        </FormItem>
      </div>

      <div className="pt-4">
        <FormField
          control={control}
          name="promotionType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Promotion Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select promotion type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">No special promotion</SelectItem>
                  <SelectItem value="featured">Featured Product</SelectItem>
                  <SelectItem value="new">New Arrival</SelectItem>
                  <SelectItem value="bestseller">Bestseller</SelectItem>
                  <SelectItem value="limited">Limited Edition</SelectItem>
                  <SelectItem value="clearance">Clearance</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default PromotionsSection;
