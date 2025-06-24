"use client";
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import Image from "next/image";

interface ImageUploaderProps {
  onImagesUpdate: (images: string[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesUpdate }) => {
  const [images, setImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleClickUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFiles = (files: File[]) => {
    const validImageFiles = files.filter((file) =>
      file.type.startsWith("image/")
    );

    if (validImageFiles.length === 0) return;

    const newImages = [...images];

    validImageFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target && typeof e.target.result === "string") {
          newImages.push(e.target.result);

          // If it's the last file, update state and parent
          if (newImages.length === images.length + validImageFiles.length) {
            setImages(newImages);
            onImagesUpdate(newImages);
          }
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    onImagesUpdate(newImages);
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="p-3 bg-gray-100 rounded-full">
            <Upload size={24} className="text-gray-600" />
          </div>
          <div>
            <p className="text-base font-medium">Drop product images here</p>
            <p className="text-sm text-gray-500">or click to browse</p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleClickUpload}
            className="mt-2"
          >
            Select Files
          </Button>
          <p className="text-xs text-gray-500">
            Supports: PNG, JPG, GIF up to 5MB
          </p>
        </div>
      </div>

      {images.length > 0 && (
        <div>
          <h3 className="font-medium mb-3">
            Uploaded Images ({images.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-md overflow-hidden border border-gray-200">
                  <Image
                    width={150}
                    height={150}
                    src={image}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default ImageUploader;
