import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import ImagePreview from "./ImagePreview";

interface ChatImageProps {
  src: string;
  alt: string;
  fileName?: string;
  className?: string;
}

const ChatImage = ({ src, alt, fileName, className = "" }: ChatImageProps) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement("a");
    link.href = src;
    link.download = fileName || "image";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <img
          src={src}
          alt={alt}
          className="max-w-xs max-h-48 object-cover rounded-lg border"
          onClick={() => setIsPreviewOpen(true)}
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
