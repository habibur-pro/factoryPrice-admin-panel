"use client";
import React, { useState } from "react";
import {
  Users,
  Shield,
  Edit3,
  Save,
  X,
  Check,
  AlertCircle,
  Plus,
} from "lucide-react";
import { useGetAllUserQuery, useUpdateUserMutation } from "@/redux/api/userApi";
import { IUser } from "@/types";
import { UserRole } from "@/enum";
import Link from "next/link";

const SuperAdminPermissionManager = () => {
  const { data: UserRes } = useGetAllUserQuery({});
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();

  const users = UserRes?.data?.map((user: Partial<IUser>) => ({
    id: user.id,
    name: user.firstName + " " + user.lastName,
    email: user.email,
    role: user.role,
    status: user.status,
    // permissions: rolePermissions[user.role] || []
  }));

  const handleEditingUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!editingUser) return;

    const { name, value } = e.target;

    setEditingUser({
      ...editingUser,
      [name]: value,
    });
  };

  const savePermissions = async (userId: string) => {
    if (!editingUser) return;
    setLoading(true);
    try {
      await updateUser(editingUser).unwrap();
      // Optionally, update your local users state here if needed
      setMessage("Permissions updated successfully!");
      setEditingUser(null);
    } catch (error) {
      setMessage("Failed to update permissions.");
      console.error("Update error:", error);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const toggleUserStatus = (userId: string) => {
    const updatedUsers = users.map((user: IUser) => {
      if (user.id === userId) {
        return {
          ...user,
          status: user.status === "active" ? "inactive" : "active",
        };
      }
      return user;
    });
    setMessage(`User status updated successfully!`);
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}

        <div className="flex justify-between items-center">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                Permission Management
              </h1>
            </div>
            <p className="text-gray-600">
              Manage user roles and permissions across all departments
            </p>
          </div>

          <Link
            href="/permission-management/add-department"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Add Department
          </Link>
        </div>
        {/* Success/Error Message */}
        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <Check className="w-5 h-5 text-green-600" />
            <span className="text-green-800">{message}</span>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Users List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">Users</h2>
              </div>

              <div className="space-y-3">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading users...</p>
                  </div>
                ) : (
                  users?.map((user: IUser, index: number) => (
                    <div
                      key={user.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedUser?.id === user.id
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {user?.firstName} {user?.lastName}
                          </h3>
                          <p className="text-sm text-gray-500">{user?.email}</p>
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                              user?.role === UserRole.super_admin
                                ? "bg-purple-100 text-purple-800"
                                : user?.role === UserRole.sales_marketting
                                ? "bg-blue-100 text-blue-800"
                                : user?.role === UserRole.accounts
                                ? "bg-green-100 text-green-800"
                                : "bg-orange-100 text-orange-800"
                            }`}
                          >
                            {user?.role}
                          </span>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span
                            className={`w-3 h-3 rounded-full ${
                              user?.status === "active"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          ></span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleUserStatus(user.id);
                            }}
                            className={`text-xs px-2 py-1 rounded ${
                              user?.status === "active"
                                ? "bg-red-100 text-red-700 hover:bg-red-200"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                            }`}
                          >
                            {user?.status === "active" ? "Active" : "Inactive"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Permission Details */}
          <div className="lg:col-span-2">
            {selectedUser ? (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </h2>
                    <p className="text-gray-500">{selectedUser.email}</p>
                  </div>
                  <button
                    onClick={() => setEditingUser(selectedUser)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Permissions
                  </button>
                </div>

                {editingUser?.id === selectedUser.id ? (
                  // Edit Mode
                  // Edit Mode
                  <div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role
                      </label>
                      <select
                        name="role"
                        value={editingUser.role}
                        onChange={handleEditingUserChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        {Object.keys(UserRole).map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        name="status"
                        value={editingUser.status}
                        onChange={handleEditingUserChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        {/* Add more status options if needed */}
                      </select>
                    </div>

                    <div className="flex gap-3 mt-8">
                      <button
                        onClick={() => savePermissions(editingUser.id)}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {updating ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        onClick={() => setEditingUser(null)}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div>
                    <div className="mb-6">
                      <span
                        className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                          selectedUser.role === UserRole.super_admin
                            ? "bg-purple-100 text-purple-800"
                            : selectedUser.role === UserRole.sales_marketting
                            ? "bg-blue-100 text-blue-800"
                            : selectedUser.role === UserRole.accounts
                            ? "bg-green-100 text-green-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {selectedUser.role}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Select a User
                </h3>
                <p className="text-gray-500">
                  Choose a user from the list to view and edit their permissions
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminPermissionManager;
