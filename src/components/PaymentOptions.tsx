import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreditCard, Upload, FileImage, X, LoaderCircle } from "lucide-react";

import { toast } from "sonner";
import { PaymentData } from "./CreateCustomOrder";
import { useUploadFileMutation } from "@/redux/api/uploaderApi";

interface PaymentOptionsProps {
  paymentData: PaymentData;
  onPaymentChange: (data: PaymentData) => void;
  setPaymentRefImage: React.Dispatch<React.SetStateAction<string | null>>;
}

const paymentMethods = [
  {
    value: "manual",
    label: "💳 Manual Payment Entry",
    description: "Record payment details manually",
  },
  {
    value: "bank-transfer",
    label: "🏦 Bank Transfer",
    description: "Direct bank transfer",
  },
  {
    value: "cash",
    label: "💵 Cash Payment",
    description: "Cash on delivery or in-person",
  },
  {
    value: "check",
    label: "📝 Check Payment",
    description: "Payment by check",
  },
  {
    value: "other",
    label: "🔄 Other Method",
    description: "Custom payment method",
  },
];

const PaymentOptions = ({
  paymentData,
  onPaymentChange,
  setPaymentRefImage,
}: PaymentOptionsProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadFile, { isLoading }] = useUploadFileMutation();
  const updatePaymentData = (
    field: keyof PaymentData,
    value: string | File
  ) => {
    onPaymentChange({
      ...paymentData,
      [field]: value,
    });
  };

  const handleFileUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      toast.error("File size must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await uploadFile(formData).unwrap();
      const url = response?.data?.url;
      setPaymentRefImage(url);
      updatePaymentData("image", file);
      toast.success("Payment image uploaded successfully!");
    } catch (error) {
      toast.error("file upload");
      console.log(error);
      return;
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const removeImage = () => {
    updatePaymentData("image", undefined as any);
    toast.success("Payment image removed");
  };

  const selectedMethod = paymentMethods.find(
    (method) => method.value === paymentData.method
  );

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 ">
          <CreditCard className="h-4 w-4" />
          Payment Method *
        </Label>
        <Select
          value={paymentData.method}
          onValueChange={(value) => updatePaymentData("method", value)}
        >
          <SelectTrigger className="w-full py-5">
            <SelectValue placeholder="Choose payment method" />
          </SelectTrigger>
          <SelectContent>
            {paymentMethods.map((method) => (
              <SelectItem key={method.value} value={method.value}>
                <div>
                  <div className="font-medium">{method.label}</div>
                  <div className="text-xs text-gray-500">
                    {method.description}
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Selected Method Info */}
      {selectedMethod && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <h4 className="font-medium mb-2">{selectedMethod.label}</h4>
            <p className="text-sm text-gray-600">
              {selectedMethod.description}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Payment Details */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Payment Details</Label>
          <Textarea
            placeholder="Enter payment details (transaction ID, reference number, notes, etc.)"
            value={paymentData.details || ""}
            onChange={(e) => updatePaymentData("details", e.target.value)}
            rows={3}
          />
          <p className="text-xs text-gray-500">
            💡 Add any relevant payment information for your records
          </p>
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <FileImage className="h-4 w-4" />
            Payment Proof (Optional)
          </Label>

          {!paymentData.image ? (
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setDragActive(false);
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600 mb-2">
                Drag & drop an image or click to upload
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="payment-image"
              />
              {isLoading && (
                <div className="flex justify-center">
                  <LoaderCircle className="animate-spin" />
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                size="sm"
                onClick={() =>
                  document.getElementById("payment-image")?.click()
                }
              >
                Choose File
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Supports JPG, PNG, GIF up to 5MB
              </p>
            </div>
          ) : (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileImage className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="font-medium text-sm">
                        {paymentData.image.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(paymentData.image.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeImage}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Payment Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            📋 Payment Summary
          </h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Method:</span>
              <span className="font-medium">
                {selectedMethod?.label || "Not selected"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Details:</span>
              <span className="font-medium">
                {paymentData.details ? "Provided" : "Not provided"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Proof Image:</span>
              <span className="font-medium">
                {paymentData.image ? "Uploaded" : "Not uploaded"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default PaymentOptions;
