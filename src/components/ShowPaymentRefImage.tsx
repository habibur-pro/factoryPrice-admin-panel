"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { useState } from "react";

const PaymentRefImage = ({ src }: { src: string }) => {
  const [open, setOpen] = useState(false);
  const fallback =
    "https://via.placeholder.com/300x200.png?text=Image+Not+Available";

  return (
    <div className="lg:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Reference Image
      </label>

      <div className="border rounded-lg p-3 bg-gray-50">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <div className="cursor-zoom-in overflow-hidden rounded border hover:shadow-md transition hover:scale-[1.01]">
              <Image
                src={src}
                alt="Reference Image"
                width={400}
                height={300}
                onError={(e) => (e.currentTarget.src = fallback)}
                className="object-contain rounded hover:scale-105 transition-transform duration-300"
              />
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-xl p-6">
            <div className="flex flex-col items-center space-y-4">
              <Image
                src={src}
                alt="Full Reference"
                width={800}
                height={600}
                onError={(e) => (e.currentTarget.src = fallback)}
                className="rounded border max-h-[70vh] object-contain"
              />
              <Button
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = src;
                  link.download = "payment-reference.jpg";
                  link.target = "_blank";
                  link.click();
                }}
              >
                Download Image
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
export default PaymentRefImage;