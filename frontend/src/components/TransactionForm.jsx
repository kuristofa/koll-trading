import { useState } from 'react';
import { CATEGORIES, UNITS, getMainCategories, getSubCategories } from '../constants/categories';

const TransactionForm = ({ onSubmit, onCancel, isLoading = false }) => {
  const [source, setSource] = useState('');
  const [items, setItems] = useState([
    {
      name: '',
      quantity: '',
      unit: 'kg',
      unitPrice: '',
      mainCategory: '',
      subCategory: ''
    }
  ]);
  const [errors, setErrors] = useState({});

  const handleSourceChange = (e) => {
    setSource(e.target.value);
    if (errors.source) {
      setErrors(prev => ({ ...prev, source: '' }));
    }
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;

    // Reset subCategory when mainCategory changes
    if (field === 'mainCategory') {
      updatedItems[index].subCategory = '';
    }

    // Auto-generate item name when both categories are selected
    if ((field === 'mainCategory' || field === 'subCategory') &&
        updatedItems[index].mainCategory && updatedItems[index].subCategory) {
      updatedItems[index].name = `${updatedItems[index].mainCategory} - ${updatedItems[index].subCategory}`;
    }

    setItems(updatedItems);

    // Clear errors
    if (errors.items?.[index]?.[field]) {
      setErrors(prev => ({
        ...prev,
        items: {
          ...prev.items,
          [index]: { ...prev.items?.[index], [field]: '' }
        }
      }));
    }
  };

  const addItem = () => {
    setItems([...items, {
      name: '',
      quantity: '',
      unit: 'kg',
      unitPrice: '',
      mainCategory: '',
      subCategory: ''
    }]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
      // Remove errors for this item
      if (errors.items?.[index]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.items[index];
          return newErrors;
        });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!source.trim()) {
      newErrors.source = 'Source is required';
    }

    const itemErrors = {};
    items.forEach((item, index) => {
      const itemErr = {};
      if (!item.quantity || item.quantity <= 0) itemErr.quantity = 'Valid quantity is required';
      if (!item.unitPrice || item.unitPrice <= 0) itemErr.unitPrice = 'Valid unit price is required';
      if (!item.mainCategory) itemErr.mainCategory = 'Main category is required';
      if (!item.subCategory) itemErr.subCategory = 'Sub category is required';

      if (Object.keys(itemErr).length > 0) {
        itemErrors[index] = itemErr;
      }
    });

    if (Object.keys(itemErrors).length > 0) {
      newErrors.items = itemErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const submitData = {
        source: source.trim(),
        items: items.map(item => ({
          ...item,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice)
        }))
      };

      onSubmit(submitData);
    }
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const qty = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.unitPrice) || 0;
      return sum + (qty * price);
    }, 0).toFixed(2);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-red-300 rounded-xl shadow-md">
      <h3 className="text-xl font-bold text-red-700 mb-4 text-center animate-bounce-in">
        Add New Transaction
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Source */}
        <div>
          <label className="block text-sm font-bold text-red-700 mb-2 uppercase tracking-wide">
            Source (Person or Junkshop)
          </label>
          <input
            type="text"
            value={source}
            onChange={handleSourceChange}
            placeholder="Enter source name"
            className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-colors ${errors.source ? 'border-red-500 bg-red-50' : ''}`}
            disabled={isLoading}
          />
          {errors.source && <p className="text-red-600 text-xs mt-1 font-medium">{errors.source}</p>}
        </div>

        {/* Items */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-bold text-red-700">Items</h4>
            <button
              type="button"
              onClick={addItem}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              disabled={isLoading}
            >
              Add Item
            </button>
          </div>

          {items.map((item, index) => (
            <div key={index} className="border-2 border-gray-200 rounded-lg p-4 mb-4 bg-white">
              <div className="flex justify-between items-center mb-3">
                <h5 className="text-md font-semibold text-red-700">Item {index + 1}</h5>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    disabled={isLoading}
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* Generated Item Name Display */}
              {item.name && (
                <div className="bg-yellow-100 border border-red-300 rounded-lg p-3 mb-4">
                  <p className="text-red-900 font-bold">{item.name}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Quantity */}
                <div>
                  <label className="block text-sm font-bold text-red-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    min="0"
                    step="0.01"
                    placeholder="Enter quantity"
                    className={`w-full p-2 border-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400 ${errors.items?.[index]?.quantity ? 'border-red-500 bg-red-50' : ''}`}
                    disabled={isLoading}
                  />
                  {errors.items?.[index]?.quantity && <p className="text-red-600 text-xs mt-1">{errors.items[index].quantity}</p>}
                </div>

                {/* Unit */}
                <div>
                  <label className="block text-sm font-bold text-red-700 mb-1">
                    Unit
                  </label>
                  <select
                    value={item.unit}
                    onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                    className="w-full p-2 border-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
                    disabled={isLoading}
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
                  <label className="block text-sm font-bold text-red-700 mb-1">
                    Unit Price (₱)
                  </label>
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                    min="0"
                    step="0.01"
                    placeholder="Enter unit price"
                    className={`w-full p-2 border-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400 ${errors.items?.[index]?.unitPrice ? 'border-red-500 bg-red-50' : ''}`}
                    disabled={isLoading}
                  />
                  {errors.items?.[index]?.unitPrice && <p className="text-red-600 text-xs mt-1">{errors.items[index].unitPrice}</p>}
                </div>

                {/* Main Category */}
                <div>
                  <label className="block text-sm font-bold text-red-700 mb-1">
                    Main Category
                  </label>
                  <select
                    value={item.mainCategory}
                    onChange={(e) => handleItemChange(index, 'mainCategory', e.target.value)}
                    className={`w-full p-2 border-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400 ${errors.items?.[index]?.mainCategory ? 'border-red-500 bg-red-50' : ''}`}
                    disabled={isLoading}
                  >
                    <option value="">Select main category</option>
                    {getMainCategories().map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.items?.[index]?.mainCategory && <p className="text-red-600 text-xs mt-1">{errors.items[index].mainCategory}</p>}
                </div>

                {/* Sub Category */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-red-700 mb-1">
                    Sub Category
                  </label>
                  <select
                    value={item.subCategory}
                    onChange={(e) => handleItemChange(index, 'subCategory', e.target.value)}
                    disabled={!item.mainCategory || isLoading}
                    className={`w-full p-2 border-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 ${errors.items?.[index]?.subCategory ? 'border-red-500 bg-red-50' : ''} ${!item.mainCategory ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  >
                    <option value="">Select sub category</option>
                    {item.mainCategory &&
                      getSubCategories(item.mainCategory).map(subcat => (
                        <option key={subcat} value={subcat}>
                          {subcat}
                        </option>
                      ))
                    }
                  </select>
                  {errors.items?.[index]?.subCategory && <p className="text-red-600 text-xs mt-1">{errors.items[index].subCategory}</p>}
                </div>
              </div>
            </div>
          ))}

          {/* Total Value */}
          <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-4 mt-4">
            <p className="text-lg font-bold text-red-700">
              Total Value: ₱{calculateTotal()}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-8">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl font-bold border-2 border-red-300 text-red-600 bg-white transition hover:bg-red-100 hover:border-red-400 hover:scale-105"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-red-500 to-red-600 shadow-lg transition transform hover:from-red-600 hover:to-red-700 hover:scale-105 flex items-center"
          >
            {isLoading && (
              <div className="modern-spinner mr-2"></div>
            )}
            Add Transaction
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;