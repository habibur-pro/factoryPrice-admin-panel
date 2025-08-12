"use client";
import { useChangePasswordMutation } from "@/redux/api/authApi";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { toast } from "sonner";

const ChangePassword = () => {
  const session = useSession();
  const userId = session?.data?.user?.id as string; // Get user ID from session
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [changePassword, { isLoading, error, isSuccess }] =
    useChangePasswordMutation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(`Field ${name} changed to:`, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form submission started");
    console.log("Form data:", formData);

    // Basic validation
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords don't match!");
      return;
    }

    if (!userId || !formData.currentPassword || !formData.newPassword) {
      console.log("Missing required fields");
      alert("Please fill in all required fields!");
      return;
    }

    try {
      const result = await changePassword({
        userId: userId,
        oldPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      }).unwrap();

      console.log("Password change successful:", result);
    } catch (err: any) {
      console.error("Password change failed:", err);
      toast.error(`Error: ${err.data?.message || "Failed to change password"}`);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Change Password
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label
            htmlFor="currentPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Current Password:
          </label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleInputChange}
            required
            placeholder="Enter current password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700"
          >
            New Password:
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            required
            placeholder="Enter new password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm New Password:
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
            placeholder="Confirm new password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-6 cursor-pointer px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? "Changing Password..." : "Change Password"}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">
              Error: {error.data?.message || "An error occurred"}
            </p>
          </div>
        )}

        {isSuccess && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-700">
              Password changed successfully!
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default ChangePassword;
