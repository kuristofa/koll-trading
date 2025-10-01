import { useState, useEffect } from 'react';
import { CATEGORIES, UNITS, getMainCategories, getSubCategories } from '../constants/categories';

const ItemForm = ({ item = null, onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    unit: 'kg',
    unitPrice: '',
    mainCategory: '',
    subCategory: ''
  });
  
  const [errors, setErrors] = useState({});

  // Populate form when editing an existing item
  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        quantity: item.quantity || '',
        unit: item.unit || 'kg',
        unitPrice: item.unitPrice || '',
        mainCategory: item.mainCategory || '',
        subCategory: item.subCategory || ''
      });
    } else {
      // Reset form for new item
      setFormData({
        name: '',
        quantity: '',
        unit: 'kg',
        unitPrice: '',
        mainCategory: '',
        subCategory: ''
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => {
      const updated = { ...prev, [name]: value };

      // Reset subCategory when mainCategory changes
      if (name === 'mainCategory') {
        updated.subCategory = '';
      }

      // Auto-generate item name when both categories are selected
      if ((name === 'mainCategory' || name === 'subCategory') && updated.mainCategory && updated.subCategory) {
        updated.name = `${updated.mainCategory} - ${updated.subCategory}`;
      }

      return updated;
    });

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = 'Valid quantity is required';
    if (!formData.unitPrice || formData.unitPrice <= 0) newErrors.unitPrice = 'Valid unit price is required';
    if (!formData.mainCategory) newErrors.mainCategory = 'Main category is required';
    if (!formData.subCategory) newErrors.subCategory = 'Sub category is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const submitData = {
        ...formData,
        quantity: Number(formData.quantity),
        unitPrice: Number(formData.unitPrice)
      };
      
      onSubmit(submitData);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      quantity: '',
      unit: 'kg',
      unitPrice: '',
      mainCategory: '',
      subCategory: ''
    });
    setErrors({});
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-red-300 rounded-xl shadow-md">
      <h3 className="text-xl font-bold text-red-700 mb-4 text-center animate-bounce-in">
        {item ? 'Edit Item' : 'Add New Item'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
         {/* Generated Item Name Display */}
         {formData.name && (
           <div className="bg-yellow-100 border-2 border-red-300 rounded-lg p-4 animate-fade-in">
             <label className="block text-sm font-bold text-red-700 mb-2 uppercase tracking-wide">
               Generated Item Name
             </label>
             <p className="text-red-900 font-bold text-lg">{formData.name}</p>
           </div>
         )}

        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          {/* Quantity */}
          <div>
            <label className="block text-sm font-bold text-red-700 mb-2 uppercase tracking-wide">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="Enter quantity"
              className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-colors ${errors.quantity ? 'border-red-500 bg-red-50' : ''}`}
              />
            {errors.quantity && <p className="text-red-600 text-xs mt-1 font-medium">{errors.quantity}</p>}
          </div>

          {/* Unit */}
          <div>
            <label className="block text-sm font-bold text-red-700 mb-2">
              Unit
            </label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-colors bg-white"
            >
              {UNITS.map(unit => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>

          {/* Unit Price */}
          <div>
            <label className="block text-sm font-bold text-red-700 mb-2">
              Unit Price (₱)
            </label>
            <input
              type="number"
              name="unitPrice"
              value={formData.unitPrice}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-colors ${
                errors.unitPrice ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
              }`}
              placeholder="Enter unit price"
            />
            {errors.unitPrice && <p className="text-red-600 text-xs mt-1 font-medium">{errors.unitPrice}</p>}
          </div>

          {/* Main Category */}
          <div>
            <label className="block text-sm font-bold text-red-700 mb-2">
              Main Category
            </label>
            <select
              name="mainCategory"
              value={formData.mainCategory}
              onChange={handleChange}
              className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-colors ${
                errors.mainCategory ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
              }`}
            >
              <option value="">Select main category</option>
              {getMainCategories().map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.mainCategory && <p className="text-red-600 text-xs mt-1 font-medium">{errors.mainCategory}</p>}
          </div>

          {/* Sub Category */}
          <div>
            <label className="block text-sm font-bold text-red-700 mb-2">
              Sub Category
            </label>
            <select
              name="subCategory"
              value={formData.subCategory}
              onChange={handleChange}
              disabled={!formData.mainCategory}
              className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-red-400 transition-colors ${
                errors.subCategory ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
              } ${!formData.mainCategory ? 'bg-gray-100 cursor-not-allowed border-gray-200' : ''}`}
            >
              <option value="">Select sub category</option>
              {formData.mainCategory &&
                getSubCategories(formData.mainCategory).map(subcat => (
                  <option key={subcat} value={subcat}>
                    {subcat}
                  </option>
                ))
              }
            </select>
            {errors.subCategory && <p className="text-red-600 text-xs mt-1 font-medium">{errors.subCategory}</p>}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-8">
          <button
            type="button"
            onClick={onCancel || resetForm}
            className="px-6 py-3 rounded-xl font-bold border-2 border-red-300 text-red-600 bg-white transition hover:bg-red-100 hover:border-red-400 hover:scale-105"
            disabled={isLoading}
          >
            {item ? 'Cancel' : 'Reset'}
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-red-500 to-red-600 shadow-lg transition transform hover:from-red-600 hover:to-red-700 hover:scale-105 flex items-center"
          >
            {isLoading && (
              <div className="modern-spinner mr-2"></div>
            )}
            {item ? 'Update Item' : 'Add Item'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ItemForm;
