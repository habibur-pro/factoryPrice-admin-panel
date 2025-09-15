"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { countries as staticCountries } from "@/data/countries";
import { useAddCategoryMutation } from "@/redux/api/categoryApi";
import {
  useAddCountryMutation,
  useDeleteCountryMutation,
  useGetCountriesQuery,
  useUpdateCountryMutation,
} from "@/redux/api/countryApi";
import { IDbCountry } from "@/types";
import { Trash2 } from "lucide-react";

interface ICountry {
  countryName: string;
  code: string;
  dialCode: string;
}

export default function CountriesPage() {
  const [addCountry] = useAddCountryMutation();
  const [deleteCountry] = useDeleteCountryMutation();
  const [updateCountry] = useUpdateCountryMutation();
  const [apiCountries, setApiCountries] = useState<ICountry[]>(staticCountries);
  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>();
  const [baseShippingCharge, setBaseShippingCharge] = useState<number>(0);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const { data: countryRes } = useGetCountriesQuery("");
  const countries: IDbCountry[] = countryRes?.data;

  const handleAddCountry = async () => {
    if (!selectedCountry) {
      toast.error("Please select a country");
      return;
    }

    const payload = {
      name: selectedCountry.countryName,
      code: selectedCountry.code,
      baseShippingCharge,
    };

    try {
      await addCountry(payload).unwrap();
      toast.success("Country added successfully");
      setIsAddOpen(false);
      setSelectedCountry(null);
      setBaseShippingCharge(0);
    } catch {
      toast.error("Failed to add country");
    }
  };

  const handleDelete = async (countryId: string) => {
    try {
      await deleteCountry(countryId).unwrap();
      toast.success("country deleted successfully");
    } catch (error) {
      console.log("err", error);
      toast.error("Failed to delete");
    }
  };

  const handleTogglePayment = async (id: string, value: boolean) => {
    try {
      await updateCountry({
        countryId: id,
        data: { isAllowAutoPayment: value },
      }).unwrap();

      toast.success("Updated successfully");
    } catch {
      toast.error("Failed to update");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Countries</h1>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>Add Country</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a New Country</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Select
                onValueChange={(code) => {
                  const country =
                    apiCountries.find((c) => c.code === code) || null;
                  setSelectedCountry(country!);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {apiCountries.map((c, i) => (
                    <SelectItem key={c.code + i} value={c.code}>
                      {c.countryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Base Shipping Charge"
                value={baseShippingCharge}
                onChange={(e) => setBaseShippingCharge(Number(e.target.value))}
              />
              <Button onClick={handleAddCountry}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Base Shipping Charge</TableHead>
            <TableHead>Allow Auto Payment</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {countries?.length > 0 &&
            countries.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.code}</TableCell>
                <TableCell>{c.baseShippingCharge}</TableCell>
                <TableCell>
                  <Switch
                    checked={c.isAllowAutoPayment}
                    onCheckedChange={(val) => handleTogglePayment(c.id, val)}
                  />
                </TableCell>
                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your account and remove your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction asChild>
                          <Button onClick={() => handleDelete(c.id)}>
                            Continue
                          </Button>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
