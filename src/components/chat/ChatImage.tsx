import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import ImagePreview from "./ImagePreview";
import Image from "next/image";

interface ChatImageProps {
  src: string;
  alt: string;
  fileName?: string;
  className?: string;
}

const ChatImage = ({ src, alt, fileName, className = "" }: ChatImageProps) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleDownload = async (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    try {
      // Fetch the image
      const response = await fetch(src);
      const blob = await response.blob();

      // Create a blob URL
      const blobUrl = window.URL.createObjectURL(blob);

      // Create download link
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName || "image";
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback to direct link if fetch fails
      const link = document.createElement("a");
      link.href = src;
      link.download = fileName || "image";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const isImageFile = (filename: string) => {
    return /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(filename);
  };

  if (!fileName || !isImageFile(fileName)) {
    return null;
  }

  return (
    <>
      <div className={`relative group cursor-pointer ${className}`}>
        <Image
          src={src}
          alt={alt}
          height={200}
          width={200}
          className="max-w-xs max-h-48 object-cover rounded-lg border"
          onClick={() => setIsPreviewOpen(false)}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDownload}
            className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-black/70 text-white border-0"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ImagePreview
        src={src}
        alt={alt}
        fileName={fileName}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </>
  );
};
export default ChatImage;
