import React from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText, File } from "lucide-react";

interface ChatFileProps {
  file: {
    filename: string;
    size: number;
    extension: string;
    url?: string;
  };
  className?: string;
}

const ChatFile = ({ file, className = "" }: ChatFileProps) => {
  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!file.url) return;

    try {
      const response = await fetch(file.url, { mode: "cors" });
      if (!response.ok) throw new Error("Failed to fetch file");

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = file.filename; // use original name with extension
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl); // clean up
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const openFile = () => {
    if (file.url) {
      window.open(file.url, "_blank");
    }
  };

  const isPdfFile = (filename: string) => {
    return /\.(pdf)$/i.test(filename);
  };

  const isTextFile = (filename: string) => {
    return /\.(txt|doc|docx)$/i.test(filename);
  };

  const getFileIcon = () => {
    if (isPdfFile(file.filename))
      return <File className="h-4 w-4 text-red-500" />;
    if (isTextFile(file.filename))
      return <FileText className="h-4 w-4 text-blue-500" />;
    return <File className="h-4 w-4 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div
      className={`flex items-center gap-3 bg-gray-50 border rounded-lg p-3 hover:bg-gray-100 transition-colors cursor-pointer ${className}`}
    >
      <div className="flex-shrink-0">{getFileIcon()}</div>
      <div className="flex-1 min-w-0" onClick={openFile}>
        <p className="text-sm font-medium text-gray-900 truncate">
          {file.filename}
        </p>
        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDownload}
        className="flex-shrink-0 h-8 w-8 p-0 hover:bg-gray-200"
      >
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );
};
export default ChatFile;
