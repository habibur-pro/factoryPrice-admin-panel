"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, User, Mail, Hash, X, MapPin, Phone } from "lucide-react";
import { debounce } from "lodash";
import { useSearchUsersQuery } from "@/redux/api/userApi";
import { IUser } from "@/types";
import Image from "next/image";

interface UserType {
  id: string;
  name: string;
  email: string;
  phone?: string;
  totalOrders?: number;
  lastOrderDate?: string;
  location?: string;
}

interface UserSelectorProps {
  selectedUser: UserType | null;
  onUserSelect: (user: IUser | null) => void;
}

const UserSelector = ({ selectedUser, onUserSelect }: UserSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  const debouncedSearch = useMemo(
    () =>
      debounce((val: string) => {
        setDebouncedTerm(val);
      }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  const { data: usersRes = [], isFetching } = useSearchUsersQuery(
    debouncedTerm,
    {
      skip: !debouncedTerm,
    }
  );
  const users: Array<IUser> = usersRes?.data;
  const clearSelection = () => {
    onUserSelect(null);
  };

  const selectUser = (user: IUser) => {
    onUserSelect(user);
    setSearchTerm("");
    setDebouncedTerm("");
  };

  if (selectedUser) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-green-900">
                {selectedUser.name}
              </h3>
              <p className="text-sm text-green-700">{selectedUser.email}</p>
              <div className="flex items-center gap-4 text-xs text-green-600 mt-1">
                <span>ID: {selectedUser.id}</span>
                {selectedUser.totalOrders && (
                  <span>📦 {selectedUser.totalOrders} orders</span>
                )}
                {selectedUser.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {selectedUser.location}
                  </span>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSelection}
            className="text-green-700 hover:text-green-900"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-gray-600">
          ✨ Perfect! Ready to create an order for this valued customer.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search by name, email, ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {searchTerm ? (
        <div className="border rounded-lg max-h-80 overflow-y-auto">
          {isFetching ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : users?.length > 0 ? (
            <div className="divide-y">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => selectUser(user)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      {user.photo ? (
                        <Image
                          src={user.photo}
                          width={64}
                          height={64}
                          alt={user.firstName}
                          className="h-7 w-7 rounded-full"
                        />
                      ) : (
                        <User className="h-5 w-5 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </h4>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Hash className="h-3 w-3" />
                          {user.id}
                        </span>
                        {user.phoneNumber && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {user.phoneNumber}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                        {user.country && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {user.country}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <User className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p>No customers found</p>
              <p className="text-sm">Try a different search term</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
          <p>Search for a customer to get started</p>
        </div>
      )}
    </div>
  );
};

export default UserSelector;
