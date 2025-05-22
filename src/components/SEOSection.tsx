
import { useState } from 'react';
import { useFormContext } from "react-hook-form";
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X, Tag, FileSearch } from "lucide-react";

interface SEOSectionProps {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const SEOSection = ({ tags, setTags }: SEOSectionProps) => {
  const { control } = useFormContext();
  const [tagInput, setTagInput] = useState('');

  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start mb-4">
        <FileSearch className="h-5 w-5 mt-1 mr-2 flex-shrink-0" />
        <div>
          <h3 className="text-md font-medium">SEO Information</h3>
          <p className="text-sm text-muted-foreground">
            Help customers find your product with the right keywords and descriptions
          </p>
        </div>
      </div>

      {/* Product Description */}
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe your product in detail..." 
                className="min-h-[150px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Meta Title */}
      <FormField
        control={control}
        name="metaTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Meta Title</FormLabel>
            <FormControl>
              <Input 
                placeholder="Title shown in search engine results" 
                {...field} 
              />
            </FormControl>
            <p className="text-xs text-muted-foreground mt-1">
              Recommended: 50-60 characters for optimal display in search results
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Meta Description */}
      <FormField
        control={control}
        name="metaDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Meta Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Brief description for search engine results" 
                className="min-h-[80px]"
                {...field} 
              />
            </FormControl>
            <p className="text-xs text-muted-foreground mt-1">
              Recommended: 150-160 characters for optimal display in search results
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Tags/Keywords */}
      <div className="space-y-2">
        <div className="flex items-center">
          <Tag className="h-4 w-4 mr-2" />
          <FormLabel>Product Tags/Keywords</FormLabel>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag, index) => (
            <div 
              key={index}
              className="flex items-center bg-secondary/50 px-3 py-1 rounded-full text-sm"
            >
              <span>{tag}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 ml-1"
                onClick={() => removeTag(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Input
            placeholder="Add keyword (press Enter)"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button type="button" onClick={addTag} disabled={!tagInput.trim()}>
            Add
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Add keywords that help customers find your product
        </p>
      </div>
    </div>
  );
};

export default SEOSection;
