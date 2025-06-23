// import { Download, X } from 'lucide-react';
// import React, { useEffect } from 'react';

// interface ImageModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   src: string;
//   alt: string;
//   title: string;
// }

// const ImageModal: React.FC<ImageModalProps> = ({ 
//   isOpen, 
//   onClose, 
//   src, 
//   alt, 
//   title 
// }) => {
//   useEffect(() => {
//     const handleEscape = (e: KeyboardEvent) => {
//       if (e.key === 'Escape') {
//         onClose();
//       }
//     };

//     if (isOpen) {
//       document.addEventListener('keydown', handleEscape);
//       document.body.style.overflow = 'hidden';
//     }

//     return () => {
//       document.removeEventListener('keydown', handleEscape);
//       document.body.style.overflow = 'unset';
//     };
//   }, [isOpen, onClose]);

//   const handleDownload = async () => {
//     try {
//       const response = await fetch(src);
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = `${title.replace(/\s+/g, '_')}.jpg`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch (error:any) {
//       console.log('Download initiated for:', error.message);
//       window.open(src, '_blank');
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       {/* Backdrop */}
//       <div 
//         className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
//         onClick={onClose}
//       />
      
//       {/* Modal Content */}
//       <div className="relative z-10 max-w-7xl max-h-[90vh] mx-4 animate-scale-in">
//         {/* Header */}
//         <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center">
//           <h2 className="text-white text-xl font-semibold bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
//             {title}
//           </h2>
          
//           <div className="flex gap-2">
//             {/* Download Button */}
//             <button
//               onClick={handleDownload}
//               className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200 shadow-lg"
//               title="Download Image"
//             >
//               <Download size={20} />
//             </button>
            
//             {/* Close Button */}
//             <button
//               onClick={onClose}
//               className="p-3 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors duration-200 backdrop-blur-sm shadow-lg"
//               title="Close (ESC)"
//             >
//               <X size={20} />
//             </button>
//           </div>
//         </div>
        
//         {/* Image */}
//         <img
//           src={src}
//           alt={alt}
//           className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
//         />
        
//         {/* Footer Info */}
//         <div className="absolute bottom-4 left-4 right-4 text-center">
//           <p className="text-white/80 text-sm bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full inline-block">
//             Press ESC to close • Click outside to close
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ImageModal;

import { Download, X } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect } from 'react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt: string;
  title: string;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  src,
  alt,
  title,
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleDownload = async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.replace(/\s+/g, '_')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.log('Fallback download for:', error.message);
      window.open(src, '_blank');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative z-10 w-[90vw] max-w-6xl h-[80vh] mx-4 animate-scale-in flex flex-col items-center justify-center bg-black/50 rounded-xl shadow-2xl p-4 backdrop-blur-lg">
        {/* Header */}
        <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center">
          <h2 className="text-white text-xl font-semibold bg-black/40 px-4 py-2 rounded-full">
            {title}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200 shadow-lg"
              title="Download Image"
            >
              <Download size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-3 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors duration-200 backdrop-blur-sm shadow-lg"
              title="Close (ESC)"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="relative w-full h-full mt-12">
          <Image
            src={src}
            alt={alt}
            layout="fill"
            objectFit="contain"
            className="rounded-lg shadow-lg"
            priority
          />
        </div>

        {/* Footer Info */}
        <div className="absolute bottom-4 left-4 right-4 text-center">
          <p className="text-white/80 text-sm bg-black/40 px-4 py-2 rounded-full inline-block">
            Press ESC to close • Click outside to close
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;

