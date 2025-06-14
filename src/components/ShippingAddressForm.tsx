import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, User, Copy, Clock } from "lucide-react";

import { toast } from "sonner";
import { ShippingAddress } from "./CreateCustomOrder";
import { useGetAddressesQuery } from "@/redux/api/userApi";
import { skip } from "node:test";
import { ICountry, IShippingAddress } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { countries } from "@/data/countries";

interface ShippingAddressFormProps {
  address: ShippingAddress;
  onAddressChange: (address: ShippingAddress) => void;
  selectedUser: any;
}

const ShippingAddressForm = ({
  address,
  onAddressChange,
  selectedUser,
}: ShippingAddressFormProps) => {
  const updateField = (
    field: keyof ShippingAddress,
    value: string | boolean
  ) => {
    onAddressChange({
      ...address,
      [field]: value,
    });
  };
  const [selectedCountry, setSelectedCountry] = useState<ICountry>(
    countries[0]
  );
  const { data: addressRes } = useGetAddressesQuery(selectedUser?.id, {
    skip: !selectedUser,
  });
  const addresses = addressRes?.data;
  const copyAddress = (savedAddress: any) => {
    onAddressChange({
      country: savedAddress.country,
      dialCode: savedAddress.dialCode,
      fullName: savedAddress.fullName,
      phoneNumber: savedAddress.phoneNumber,
      streetAddress: savedAddress.streetAddress,
      city: savedAddress.city,
      state: savedAddress.state,
      postalCode: savedAddress.postalCode,
      apartment: savedAddress.apartment,
      isDefault: savedAddress.isDefault,
    });
    toast.success("📋 Address copied successfully!");
  };

  // Auto-fill name when user is selected
  // useEffect(() => {
  //   if (selectedUser && !address.fullName) {
  //     updateField("fullName", selectedUser.name);
  //     if (selectedUser.phone) {
  //       updateField("phoneNumber", selectedUser.phone);
  //     }
  //   }
  // }, [selectedUser, address.fullName]);

  return (
    <div className="space-y-6">
      {/* Previous Addresses */}
      {selectedUser && (
        <div className="space-y-3">
          <h4 className="font-medium text-sm flex items-center gap-2">
            📋 Quick Fill from Previous Addresses
            <Badge variant="secondary" className="text-xs">
              {addresses?.length} saved
            </Badge>
          </h4>
          <div className="grid gap-3">
            {addresses?.length > 0 &&
              addresses.map((savedAddress: IShippingAddress) => (
                <Card
                  key={savedAddress.id}
                  className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-blue-200"
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {savedAddress.fullName}
                          </span>
                          {savedAddress.isDefault && (
                            <Badge variant="default" className="text-xs">
                              Default
                            </Badge>
                          )}
                          {/* <Badge variant="outline" className="text-xs">
                            {savedAddress.addressType}
                          </Badge> */}
                        </div>
                        <p className="text-xs text-gray-600 mb-1">
                          {savedAddress.apartment}
                        </p>
                        <p className="text-xs text-gray-600 mb-1">
                          {savedAddress.city}, {savedAddress.state}{" "}
                          {savedAddress.postalCode}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          {savedAddress.country}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyAddress(savedAddress)}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* Address Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* country  */}

        <div className="space-y-2">
          <Label htmlFor="country">Country *</Label>
          <Select
            value={address.country}
            onValueChange={(val) => {
              const selected = countries.find((c) => c.countryName === val);
              if (selected) {
                address.country = selected.countryName;
                address.dialCode = selected.dialCode;
                setSelectedCountry(selected);
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country, i) => (
                <SelectItem
                  key={`${country.code} ${i}`}
                  value={country.countryName}
                >
                  {country.countryName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* full name  */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <User className="h-3 w-3" />
            Full Name *
          </Label>
          <Input
            placeholder="Enter recipient's full name"
            value={address.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
          />
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number *</Label>
          <div className="flex">
            <div className="flex items-center px-3 border border-r-0 bg-gray-50 rounded-l-md min-w-[80px]">
              <span className="text-sm text-gray-600">
                {address?.dialCode || selectedCountry?.dialCode || "+1"}
              </span>
            </div>
            <Input
              placeholder="123-456-7890"
              className="rounded-l-none"
              value={address.phoneNumber}
              onChange={(e) => updateField("phoneNumber", e.target.value)}
            />
          </div>
        </div>

        <div className=" space-y-2">
          <Label className="flex items-center gap-2">
            <MapPin className="h-3 w-3" />
            Street Address *
          </Label>
          <Input
            placeholder="Street number, street name, apartment/unit"
            value={address.streetAddress}
            onChange={(e) => updateField("streetAddress", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>City *</Label>
          <Input
            placeholder="Enter city name"
            value={address.city}
            onChange={(e) => updateField("city", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>State/Province *</Label>
          <Input
            placeholder="Enter state or province"
            value={address.state}
            onChange={(e) => updateField("state", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Postal/ZIP Code *</Label>
          <Input
            placeholder="Enter postal or ZIP code"
            value={address.postalCode}
            onChange={(e) => updateField("postalCode", e.target.value)}
          />
        </div>
        {/* Apartment */}
        <div className="space-y-2">
          <Label htmlFor="apartment">Apartment (Optional)</Label>
          <Input
            placeholder="Apt, suite, etc."
            value={address.apartment}
            onChange={(e) => updateField("apartment", e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="default-address"
            checked={address.isDefault}
            onCheckedChange={(checked) => updateField("isDefault", checked)}
          />
          <Label htmlFor="default-address" className="text-sm">
            Save as default address for this customer
          </Label>
        </div>
      </div>

      {/* Address Validation Preview */}
      {address.streetAddress &&
        address.city &&
        address.state &&
        address.postalCode && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <MapPin className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800 mb-1">
                  ✅ Address Ready for Shipping
                </p>
                <div className="text-sm text-green-700">
                  <p className="font-medium">{address.fullName}</p>
                  <p>{address.streetAddress}</p>
                  <p>
                    {address.city}, {address.state} {address.postalCode}
                  </p>
                  <p>{address.phoneNumber}</p>
                </div>
                <p className="text-xs text-green-600 mt-2">
                  📦 Estimated delivery: 3-5 business days
                </p>
              </div>
            </div>
          </div>
        )}

      {/* Helper Text */}
      {(!address.streetAddress || !address.city) && (
        <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 Fill in the address details to see shipping preview
          </p>
        </div>
      )}
    </div>
  );
};
export default ShippingAddressForm;
