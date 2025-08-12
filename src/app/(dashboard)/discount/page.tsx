"use client"
import React, { useState, useEffect } from 'react';
import { Calendar, Percent, Tag, Package, ShoppingCart, Plus, Trash2, Edit, Save, X, Eye, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import { useGetTopLevelCategoriesQuery } from '@/redux/api/categoryApi';
import { useGetAllProductQuery } from '@/redux/api/productApi';
import { IDiscount, IProduct } from '@/types';
import { useAddDiscountMutation, useGetAllDiscountQuery } from '@/redux/api/discountApi';

const DiscountManagement = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [discountScope, setDiscountScope] = useState<"single" | "multiple" | "category" | "all">("single");
  const [showForm, setShowForm] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingDiscount, setViewingDiscount] = useState(null);
  const [addDiscount] = useAddDiscountMutation()
  const { data: topLevelCategoriesRes, isLoading: categoryLoading } = useGetTopLevelCategoriesQuery({})

  const categories = topLevelCategoriesRes?.data?.map((item: { id: string, categoryName: string }) => ({
    id: item?.id,
    categoryName: item?.categoryName
  }))

  const { data: productRes, isLoading: productLoading } = useGetAllProductQuery({})

  const products = productRes?.data?.map((item: { id: string, name: string, basePrice: number, sku: string }) => ({
    id: item?.id,
    name: item?.name,
    basePrice: item?.basePrice,
    sku: item?.sku
  }))

  const { data: discountRes, isLoading: discountLoading } = useGetAllDiscountQuery({})

  const discounts = discountRes?.data?.map((item: {
    id: string,
    title: string,
    discountScope: "single" | "multiple" | "all" | "category",
    startDate: Date,
    endDate: Date,
    discountValue: number,
    status: string
  }) => ({
    id: item?.id,
    name: item?.title,
    type: item?.discountScope,
    startDate: new Date(item?.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), // example: 06 Aug 2025
    endDate: new Date(item?.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    discountValue: item?.discountValue,
    status: item?.status
  }))
  





  // Helper function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Helper function to get date 30 days from today
  const getDefaultEndDate = () => {
    const today = new Date();
    const endDate = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days from today
    return endDate.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    name: '',
    discountValue: '',
    startDate: getTodayDate(),
    endDate: getDefaultEndDate(),
    selectedProducts: [],
    selectedCategory: '',
    productLimit: ''
  });

  const handleFormSubmit = async () => {

    const newDiscount = {
      id: editingDiscount ? editingDiscount.id : Date.now().toString(),
      title: formData.name,
      discountScope: discountScope,
      target: discountScope === 'single'
        ? formData.selectedProducts.map(p => products.find(prod => prod.id === p)?.name).join(', ')
        : discountScope === 'category'
          ? categories.find(c => c.id === formData.selectedCategory)?.categoryName
          : 'All Products',
      discountValue: parseFloat(formData.discountValue),
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: 'active',
      ...(discountScope === 'single' && { productId: formData.selectedProducts[0] }),
      ...(discountScope === 'category' && { categoryId: formData.selectedCategory }),
      ...(discountScope === 'multiple' && {
        productIds: formData.selectedProducts.slice(0, parseInt(formData.productLimit))
      })
    };

    if (editingDiscount) {
      setDiscounts(prev => prev.map(d => d.id === editingDiscount.id ? newDiscount : d));
    } else {
      setDiscounts(prev => [...prev, newDiscount]);
    }

    try {
      const response = await addDiscount(newDiscount)
      .unwrap()
    } catch (error) {

    }

    // Reset form with default dates
    setFormData({
      name: '',
      discountValue: '',
      startDate: getTodayDate(),
      endDate: getDefaultEndDate(),
      selectedProducts: [],
      selectedCategory: '',
      productLimit: ''
    });
    setShowForm(false);
    setEditingDiscount(null);
  };

  const handleView = (discount) => {
    setViewingDiscount(discount);
    setShowViewModal(true);
  };

  const handleEdit = (discount) => {
    setEditingDiscount(discount);
    setDiscountScope(discount.type);
    setFormData({
      name: discount.name,
      discountValue: discount.discountValue.toString(),
      startDate: discount.startDate,
      endDate: discount.endDate,
      selectedProducts: discount.productIds || [],
      selectedCategory: discount.categoryId || '',
      productLimit: discount.productIds?.length.toString() || ''
    });
    setActiveTab('create'); // Switch to create tab for editing
    setShowForm(true);
  };

  const handleDelete = (discountId) => {
    setDiscounts(prev => prev.filter(d => d.id !== discountId));
  };

  const handleProductSelection = (productId: string) => {
    if (discountScope === 'single') {
      const limit = 1;
      setFormData(prev => ({
        ...prev,
        selectedProducts: prev.selectedProducts.includes(productId)
          ? prev.selectedProducts.filter(id => id !== productId)
          : prev.selectedProducts.length < limit
            ? [...prev.selectedProducts, productId]
            : prev.selectedProducts
      }));
    } else if (discountScope === 'multiple') {
      const limit = parseInt(formData.productLimit) || 10;
      setFormData(prev => ({
        ...prev,
        selectedProducts: prev.selectedProducts.includes(productId)
          ? prev.selectedProducts.filter(id => id !== productId)
          : prev.selectedProducts.length < limit
            ? [...prev.selectedProducts, productId]
            : prev.selectedProducts
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        selectedProducts: prev.selectedProducts.includes(productId)
          ? prev.selectedProducts.filter(id => id !== productId)
          : [...prev.selectedProducts, productId]
      }));
    }
  };

  // Auto-update end date when start date changes
  useEffect(() => {
    if (formData.startDate && !editingDiscount) {
      const startDate = new Date(formData.startDate);
      const newEndDate = new Date(startDate.getTime() + (30 * 24 * 60 * 60 * 1000));
      setFormData(prev => ({
        ...prev,
        endDate: newEndDate.toISOString().split('T')[0]
      }));
    }
  }, [formData.startDate, editingDiscount]);


  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-gradient-to-r from-green-500 to-emerald-500', text: 'Active', icon: CheckCircle2 },
      expired: { color: 'bg-gradient-to-r from-gray-400 to-gray-500', text: 'Expired', icon: Clock },
      scheduled: { color: 'bg-gradient-to-r from-blue-500 to-indigo-500', text: 'Scheduled', icon: Calendar }
    };
    
    const config = statusConfig[status] || statusConfig.active;
    const IconComponent = config.icon;
    
    return (
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white ${config.color} shadow-lg`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.text}
      </div>
    );
  };

  const getDiscountTypeIcon = (type) => {
    const icons = {
      single: Package,
      multiple: ShoppingCart,
      category: Tag,
      all: Sparkles
    };
    return icons[type] || Package;
  };

  if (categoryLoading || productLoading) {
    return <h1>Loading....</h1>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-full mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Percent className="h-6 w-6 text-blue-600" />
              Discount Management System
            </h1>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('create')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'create'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Create Discount
              </button>
              <button
                onClick={() => setActiveTab('manage')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'manage'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Manage Discounts
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'create' && (
              <div className="space-y-6">
                {!showForm ? (
                  <div className="text-center py-12">
                    <Percent className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Create New Discount</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Set up discounts for products, categories, or store-wide promotions
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={() => setShowForm(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Discount
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">
                        {editingDiscount ? 'Edit Discount' : 'Create New Discount'}
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          setShowForm(false);
                          setEditingDiscount(null);
                          setFormData({
                            name: '',
                            discountValue: '',
                            startDate: getTodayDate(),
                            endDate: getDefaultEndDate(),
                            selectedProducts: [],
                            selectedCategory: '',
                            productLimit: ''
                          });
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Discount Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Discount Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter discount name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Discount Percentage
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            required
                            min="0"
                            max="100"
                            step="0.01"
                            value={formData.discountValue}
                            onChange={(e) => setFormData(prev => ({ ...prev, discountValue: e.target.value }))}
                            className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                          />
                          <Percent className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Start Date
                        </label>
                        <input
                          type="date"
                          required
                          min={getTodayDate()}
                          value={formData.startDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Default: Today&apos;s date</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          End Date
                        </label>
                        <input
                          type="date"
                          required
                          min={formData.startDate || getTodayDate()}
                          value={formData.endDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Default: 30 days from start date</p>
                      </div>
                    </div>

                    {/* Discount Type Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Discount Type
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div
                          onClick={() => setDiscountScope('single')}
                          className={`cursor-pointer p-4 border rounded-lg ${discountScope === 'single'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                          <Package className="h-6 w-6 text-blue-600 mb-2" />
                          <h4 className="font-medium text-gray-900">Single Product</h4>
                          <p className="text-sm text-gray-500">Apply to specific products</p>
                        </div>

                        {/* <div
                          onClick={() => setDiscountScope('multiple')}
                          className={`cursor-pointer p-4 border rounded-lg ${discountScope === 'multiple'
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                          <ShoppingCart className="h-6 w-6 text-green-600 mb-2" />
                          <h4 className="font-medium text-gray-900">Multiple Products</h4>
                          <p className="text-sm text-gray-500">Apply to limited number of products</p>
                        </div> */}

                        <div
                          onClick={() => setDiscountScope('category')}
                          className={`cursor-pointer p-4 border rounded-lg ${discountScope === 'category'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                          <Tag className="h-6 w-6 text-purple-600 mb-2" />
                          <h4 className="font-medium text-gray-900">Category</h4>
                          <p className="text-sm text-gray-500">Apply to entire category</p>
                        </div>

                        <div
                          onClick={() => setDiscountScope('all')}
                          className={`cursor-pointer p-4 border rounded-lg ${discountScope === 'all'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                          <Package className="h-6 w-6 text-orange-600 mb-2" />
                          <h4 className="font-medium text-gray-900">All Products</h4>
                          <p className="text-sm text-gray-500">Store-wide discount</p>
                        </div>
                      </div>
                    </div>

                    {/* Product Limit for Selected Products */}
                    {discountScope === 'multiple' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Number of Products to Discount
                        </label>
                        <input
                          type="number"
                          min="1"
                          max={products.length}
                          value={formData.productLimit}
                          onChange={(e) => setFormData(prev => ({ ...prev, productLimit: e.target.value }))}
                          className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter number"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          You can select up to {formData.productLimit || 0} products from the list below
                        </p>
                      </div>
                    )}

                    {/* Category Selection */}
                    {discountScope === 'category' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Category
                        </label>
                        <select
                          required
                          value={formData.selectedCategory}
                          onChange={(e) => setFormData(prev => ({ ...prev, selectedCategory: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Choose a category</option>
                          {categories.map(category => (
                            <option key={category.id} value={category.id}>
                              {category.categoryName}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Product Selection */}
                    {(discountScope === 'single' || discountScope === 'multiple') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Select Products
                          {discountScope === 'multiple' && formData.productLimit && (
                            <span className="text-sm text-gray-500 ml-2">
                              ({formData.selectedProducts.length}/{formData.productLimit} selected)
                            </span>
                          )}
                        </label>
                        <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-md">
                          {products.map((product: IProduct) => (
                            <div
                              key={product.id}
                              className={`flex items-center p-3 border-b border-gray-100 hover:bg-gray-50 ${formData.selectedProducts.includes(product.id) ? 'bg-blue-50' : ''
                                }`}
                            >
                              <input
                                type="checkbox"
                                checked={formData.selectedProducts.includes(product.id)}
                                onChange={() => handleProductSelection(product.id)}
                                className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                disabled={
                                  discountScope === 'multiple' &&
                                  !formData.selectedProducts.includes(product.id) &&
                                  formData.selectedProducts.length >= parseInt(formData.productLimit || '0')
                                }
                              />
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{product.name}</div>
                                <div className="text-sm text-gray-500">
                                  SKU: {product.sku} | Price: ${product.basePrice}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => {
                          setShowForm(false);
                          setEditingDiscount(null);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleFormSubmit}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {editingDiscount ? 'Update Discount' : 'Create Discount'}
                      </button>
                    </div>

                  </div>
                )}
              </div>
            )}

            {activeTab === 'manage' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Active Discounts</h3>
                  <button
                    onClick={() => {
                      setActiveTab('create');
                      setShowForm(true);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Discount
                  </button>
                </div>

                <div className="grid gap-6">
                {discounts.map((discount:any) => {
                  const IconComponent = getDiscountTypeIcon(discount.type);
                  return (
                    <div key={discount.id} className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:border-blue-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
                              <IconComponent className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h4 className="text-xl font-bold text-gray-900">{discount.name}</h4>
                              <p className="text-gray-600">{discount.target}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                              {getStatusBadge(discount.status)}
                              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                                {discount.discountValue}% OFF
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-6 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4" />
                              <span>{discount.startDate} - {discount.endDate}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => handleView(discount)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleEdit(discount)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(discount.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

                {discounts.length === 0 && (
                  <div className="text-center py-12">
                    <Percent className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No discounts yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Create your first discount to start offering promotions to your customers.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

     {/* Enhanced View Modal */}
     {showViewModal && (viewingDiscount as IDiscount) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Discount Details</h3>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-white/80 hover:text-white p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Discount Name</label>
                  <p className="text-lg font-semibold text-gray-900 bg-gray-50 p-3 rounded-xl">{viewingDiscount?.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Discount Value</label>
                  <p className="text-lg font-semibold  bg-gradient-to-r from-green-500 to-emerald-500 text-white p-3 rounded-xl">
                    {viewingDiscount?.discountValue}% OFF
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-xl">{viewingDiscount.startDate}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-xl">{viewingDiscount.endDate}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                {getStatusBadge(viewingDiscount.status)}
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-semibold transition-all"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEdit(viewingDiscount);
                  }}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Discount
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

};

export default DiscountManagement;