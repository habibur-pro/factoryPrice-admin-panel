
import { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, Image, MoveUp, MoveDown } from "lucide-react";

interface ProductMediaProps {
  images: File[];
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
}

const ProductMedia = ({ images, setImages }: ProductMediaProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  
  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files).filter(file => 
      file.type === 'image/jpeg' || 
      file.type === 'image/png' || 
      file.type === 'image/webp' ||
      file.type === 'image/gif'
    );
    
    setImages(prev => [...prev, ...newFiles]);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };
  
  const moveImage = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === images.length - 1)
    ) {
      return;
    }
    
    const newImages = [...images];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    
    setImages(newImages);
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center py-4">
          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm mb-1">
            <span className="font-medium">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-muted-foreground">
            JPEG, PNG, WebP or GIF (max. 5MB each)
          </p>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />
          
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => fileInputRef.current?.click()}
          >
            Select Files
          </Button>
        </div>
      </div>

      {images.length > 0 && (
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Product Images ({images.length})
          </Label>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {images.map((file, index) => (
              <div key={index} className="relative group border rounded-md overflow-hidden">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-24 object-cover"
                />
                
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-1">
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 bg-white/80 hover:bg-white"
                        onClick={() => moveImage(index, 'up')}
                      >
                        <MoveUp className="h-3 w-3" />
                      </Button>
                    )}
                    
                    {index < images.length - 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 bg-white/80 hover:bg-white"
                        onClick={() => moveImage(index, 'down')}
                      >
                        <MoveDown className="h-3 w-3" />
                      </Button>
                    )}
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 bg-white/80 hover:bg-white text-red-500 hover:text-red-700"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                {index === 0 && (
                  <div className="absolute top-0 left-0 bg-primary text-white text-xs px-1.5 py-0.5">
                    Main
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <p className="text-xs text-muted-foreground mt-2">
            Drag images to reorder. The first image will be used as the main product image.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductMedia;
