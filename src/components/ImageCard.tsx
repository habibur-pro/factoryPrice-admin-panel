import { Download, Eye } from "lucide-react";
import React, { useState } from "react";
import ImageModal from "./ImageModal";
import Image from "next/image";

interface ImageCardProps {
  src: string;
  alt: string;
  title?: string;
  fileName?: string;
}

const ImageCard: React.FC<ImageCardProps> = ({
  src,
  alt,
  title = "Beautiful Image",
  fileName = "image.jpg",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDownload = async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.log("Download initiated for:", error.message);
      // Fallback: open image in new tab
      window.open(src, "_blank");
    }
  };

  return (
    <>
      <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            height={300}
            width={300}
            src={src}
            alt={alt}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Overlay with Buttons */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
            {/* View Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-white/90 backdrop-blur-sm text-gray-800 rounded-full font-medium hover:bg-white transition-all duration-200 transform translate-y-4 group-hover:translate-y-0 shadow-lg hover:shadow-xl"
            >
              <Eye size={20} />
              <span>View</span>
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-all duration-200 transform translate-y-4 group-hover:translate-y-0 shadow-lg hover:shadow-xl"
            >
              <Download size={20} />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm">
            Click to view or download this beautiful image
          </p>
        </div>
      </div>

      {/* Modal */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        src={src}
        alt={alt}
        title={title}
      />
    </>
  );
};

export default ImageCard;
