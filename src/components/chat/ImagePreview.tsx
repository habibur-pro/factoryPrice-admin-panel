import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import Image from "next/image";

interface ImagePreviewProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
  fileName?: string;
}

const ImagePreview = ({
  src,
  alt,
  isOpen,
  onClose,
  fileName,
}: ImagePreviewProps) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = src;
    link.download = fileName || "image";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <div className="relative">
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDownload}
              className="bg-black/50 hover:bg-black/70 text-white border-0"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
              className="bg-black/50 hover:bg-black/70 text-white border-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Image
            height={1000}
            width={1000}
            src={src}
            alt={alt}
            className="w-full h-auto max-h-[90vh] object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default ImagePreview;
