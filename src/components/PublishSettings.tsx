import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { ToggleRight } from "lucide-react";

const PublishSettings = () => {
  const { control } = useFormContext();

  return (
    <div className="space-y-4">
      <div className="flex items-start space-x-2">
        <ToggleRight className="h-5 w-5 mt-1" />
        <div>
          <h3 className="text-md font-medium">Visibility Settings</h3>
          <p className="text-sm text-muted-foreground">
            Control when this product is visible to customers
          </p>
        </div>
      </div>

      <FormField
        control={control}
        name="isActive"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Active Product</FormLabel>
              <FormDescription>
                The product will be visible in your catalog
              </FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />

      <div className="rounded-lg border p-4 space-y-2">
        <h4 className="font-medium">Important Notes</h4>
        <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
          <li>
            Inactive products won&apos;t appear in search results or categories
          </li>
          <li>
            Products with no stock will be marked as &quot;Out of Stock&ldquo;
          </li>
          <li>You can change the status at any time</li>
        </ul>
      </div>
    </div>
  );
};

export default PublishSettings;
