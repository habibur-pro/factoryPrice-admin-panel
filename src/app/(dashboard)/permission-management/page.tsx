"use client"
import React, { useState, useEffect } from 'react';
import { Users, Shield, Edit3, Save, X, Check, AlertCircle } from 'lucide-react';

const SuperAdminPermissionManager = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Define available permissions for each role
  const rolePermissions = {
    'Sales & Marketing': {
      products: ['add', 'edit', 'view'],
      payments: [],
      orders: [],
      shipping: [],
      system: []
    },
    'Accounts': {
      products: [],
      payments: ['view', 'manage', 'refund', 'reports'],
      orders: ['view'],
      shipping: [],
      system: []
    },
    'Shipping': {
      products: [],
      payments: [],
      orders: ['view', 'manage'],
      shipping: ['view', 'update', 'track'],
      system: []
    },
    'Super Admin': {
      products: ['add', 'edit', 'view', 'delete'],
      payments: ['view', 'manage', 'refund', 'reports'],
      orders: ['view', 'manage', 'delete'],
      shipping: ['view', 'update', 'track', 'manage'],
      system: ['all']
    }
  };

  const permissionLabels = {
    products: 'Product Management',
    payments: 'Payment Management',
    orders: 'Order Management',
    shipping: 'Shipping Management',
    system: 'System Settings'
  };

  const actionLabels = {
    add: 'Add',
    edit: 'Edit',
    view: 'View',
    delete: 'Delete',
    manage: 'Manage',
    refund: 'Issue Refunds',
    reports: 'Generate Reports',
    update: 'Update Status',
    track: 'Track Deliveries',
    all: 'Full Access'
  };

  // Mock data - replace with actual API calls
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockUsers = [
        {
          id: 1,
          name: 'John Smith',
          email: 'john.smith@company.com',
          role: 'Sales & Marketing',
          status: 'active',
          permissions: rolePermissions['Sales & Marketing']
        },
        {
          id: 2,
          name: 'Sarah Johnson',
          email: 'sarah.johnson@company.com',
          role: 'Accounts',
          status: 'active',
          permissions: rolePermissions['Accounts']
        },
        {
          id: 3,
          name: 'Mike Wilson',
          email: 'mike.wilson@company.com',
          role: 'Shipping',
          status: 'active',
          permissions: rolePermissions['Shipping']
        },
        {
          id: 4,
          name: 'Emily Davis',
          email: 'emily.davis@company.com',
          role: 'Sales & Marketing',
          status: 'inactive',
          permissions: rolePermissions['Sales & Marketing']
        }
      ];
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  };

  const handleRoleChange = (userId, newRole) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          role: newRole,
          permissions: rolePermissions[newRole]
        };
      }
      return user;
    });
    setUsers(updatedUsers);
    setEditingUser({ ...editingUser, role: newRole, permissions: rolePermissions[newRole] });
  };

  const handlePermissionToggle = (category, action) => {
    const currentPermissions = { ...editingUser.permissions };
    const categoryPermissions = [...currentPermissions[category]];
    
    if (categoryPermissions.includes(action)) {
      currentPermissions[category] = categoryPermissions.filter(perm => perm !== action);
    } else {
      currentPermissions[category] = [...categoryPermissions, action];
    }
    
    setEditingUser({ ...editingUser, permissions: currentPermissions });
  };

  const savePermissions = async (userId) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedUsers = users.map(user => 
        user.id === userId ? editingUser : user
      );
      setUsers(updatedUsers);
      setEditingUser(null);
      setMessage('Permissions updated successfully!');
      setLoading(false);
      
      setTimeout(() => setMessage(''), 3000);
    }, 500);
  };

  const toggleUserStatus = (userId) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          status: user.status === 'active' ? 'inactive' : 'active'
        };
      }
      return user;
    });
    setUsers(updatedUsers);
    setMessage(`User status updated successfully!`);
    setTimeout(() => setMessage(''), 3000);
  };

  const getAllAvailableActions = () => {
    const allActions = new Set();
    Object.values(rolePermissions).forEach(role => {
      Object.values(role).forEach(permissions => {
        permissions.forEach(action => allActions.add(action));
      });
    });
    return Array.from(allActions);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Permission Management</h1>
          </div>
          <p className="text-gray-600">Manage user roles and permissions across all departments</p>
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
                  users.map(user => (
                    <div
                      key={user.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedUser?.id === user.id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{user.name}</h3>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                            user.role === 'Super Admin' 
                              ? 'bg-purple-100 text-purple-800'
                              : user.role === 'Sales & Marketing'
                              ? 'bg-blue-100 text-blue-800'
                              : user.role === 'Accounts'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {user.role}
                          </span>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`w-3 h-3 rounded-full ${
                            user.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                          }`}></span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleUserStatus(user.id);
                            }}
                            className={`text-xs px-2 py-1 rounded ${
                              user.status === 'active'
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {user.status === 'active' ? 'Deactivate' : 'Activate'}
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
                    <h2 className="text-xl font-semibold text-gray-900">{selectedUser.name}</h2>
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
                  <div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role
                      </label>
                      <select
                        value={editingUser.role}
                        onChange={(e) => handleRoleChange(editingUser.id, e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        {Object.keys(rolePermissions).map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-6">
                      {Object.entries(permissionLabels).map(([category, label]) => (
                        <div key={category}>
                          <h3 className="text-lg font-medium text-gray-900 mb-3">{label}</h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {getAllAvailableActions().map(action => (
                              <label
                                key={`${category}-${action}`}
                                className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={editingUser.permissions[category]?.includes(action) || false}
                                  onChange={() => handlePermissionToggle(category, action)}
                                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <span className="text-sm text-gray-700">{actionLabels[action]}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3 mt-8">
                      <button
                        onClick={() => savePermissions(editingUser.id)}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {loading ? 'Saving...' : 'Save Changes'}
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
                      <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                        selectedUser.role === 'Super Admin' 
                          ? 'bg-purple-100 text-purple-800'
                          : selectedUser.role === 'Sales & Marketing'
                          ? 'bg-blue-100 text-blue-800'
                          : selectedUser.role === 'Accounts'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {selectedUser.role}
                      </span>
                    </div>

                    <div className="space-y-6">
                      {Object.entries(selectedUser.permissions).map(([category, permissions]) => (
                        <div key={category}>
                          <h3 className="text-lg font-medium text-gray-900 mb-3">
                            {permissionLabels[category]}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {permissions.length > 0 ? (
                              permissions.map(permission => (
                                <span
                                  key={permission}
                                  className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full"
                                >
                                  {actionLabels[permission]}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-500 text-sm flex items-center gap-1">
                                <X className="w-4 h-4" />
                                No access
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Select a User</h3>
                <p className="text-gray-500">Choose a user from the list to view and edit their permissions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminPermissionManager;