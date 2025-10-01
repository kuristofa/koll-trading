import { useState } from 'react';
import { CATEGORIES, UNITS, getMainCategories, getSubCategories } from '../constants/categories';
import { transactionService } from '../services/transactionService';

const AddTransactionModal = ({ isOpen, onClose, onTransactionAdded }) => {
  const [step, setStep] = useState(1); // 1: source, 2: items
  const [source, setSource] = useState('');
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({
    name: '',
    quantity: '',
    unit: 'kg',
    unitPrice: '',
    mainCategory: '',
    subCategory: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetModal = () => {
    setStep(1);
    setSource('');
    setItems([]);
    setCurrentItem({
      name: '',
      quantity: '',
      unit: 'kg',
      unitPrice: '',
      mainCategory: '',
      subCategory: ''
    });
    setErrors({});
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleSourceSubmit = (e) => {
    e.preventDefault();
    if (!source.trim()) {
      setErrors({ source: 'Source is required' });
      return;
    }
    setErrors({});
    setStep(2);
  };

  const handleItemChange = (field, value) => {
    const updatedItem = { ...currentItem, [field]: value };

    // Reset subCategory when mainCategory changes
    if (field === 'mainCategory') {
      updatedItem.subCategory = '';
    }

    // Auto-generate item name when both categories are selected
    if ((field === 'mainCategory' || field === 'subCategory') &&
        updatedItem.mainCategory && updatedItem.subCategory) {
      updatedItem.name = `${updatedItem.mainCategory} - ${updatedItem.subCategory}`;
    }

    setCurrentItem(updatedItem);

    // Clear errors
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateItem = () => {
    const newErrors = {};
    if (!currentItem.quantity || currentItem.quantity <= 0) newErrors.quantity = 'Valid quantity required';
    if (!currentItem.unitPrice || currentItem.unitPrice <= 0) newErrors.unitPrice = 'Valid unit price required';
    if (!currentItem.mainCategory) newErrors.mainCategory = 'Main category required';
    if (!currentItem.subCategory) newErrors.subCategory = 'Sub category required';
    return newErrors;
  };

  const addItemToList = () => {
    const itemErrors = validateItem();
    if (Object.keys(itemErrors).length > 0) {
      setErrors(itemErrors);
      return;
    }

    setItems([...items, {
      ...currentItem,
      quantity: Number(currentItem.quantity),
      unitPrice: Number(currentItem.unitPrice)
    }]);

    // Reset current item form
    setCurrentItem({
      name: '',
      quantity: '',
      unit: 'kg',
      unitPrice: '',
      mainCategory: '',
      subCategory: ''
    });
    setErrors({});
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const handleSaveTransaction = async () => {
    if (items.length === 0) {
      setErrors({ general: 'Add at least one item to the transaction' });
      return;
    }

    setIsSubmitting(true);
    try {
      const transactionData = {
        source: source.trim(),
        items: items
      };

      const newTransaction = await transactionService.createTransaction(transactionData);
      onTransactionAdded(newTransaction);
      handleClose();
    } catch (error) {
      setErrors({ general: 'Failed to save transaction. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-red-600 text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Add New Transaction</h2>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            /* Step 1: Source Input */
            <div>
              <h3 className="text-lg font-semibold mb-4 text-red-700">Step 1: Enter Source</h3>
              <form onSubmit={handleSourceSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Source (Person or Junkshop)
                  </label>
                  <input
                    type="text"
                    value={source}
                    onChange={(e) => {
                      setSource(e.target.value);
                      if (errors.source) setErrors({});
                    }}
                    placeholder="Enter source name"
                    className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 ${
                      errors.source ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.source && <p className="text-red-600 text-sm mt-1">{errors.source}</p>}
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Next: Add Items
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 2 && (
            /* Step 2: Add Items */
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-red-700">Step 2: Add Items</h3>
                <span className="text-sm text-gray-600">Source: <strong>{source}</strong></span>
              </div>

              {/* Add Item Form */}
              <div className="border-2 border-gray-200 rounded-lg p-4 mb-6 bg-gray-50">
                <h4 className="font-medium mb-3 text-red-700">Add New Item</h4>
                <div className="grid grid-cols-6 gap-3 mb-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Main Category</label>
                    <select
                      value={currentItem.mainCategory}
                      onChange={(e) => handleItemChange('mainCategory', e.target.value)}
                      className={`w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-red-400 ${
                        errors.mainCategory ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select</option>
                      {getMainCategories().map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Sub Category</label>
                    <select
                      value={currentItem.subCategory}
                      onChange={(e) => handleItemChange('subCategory', e.target.value)}
                      disabled={!currentItem.mainCategory}
                      className={`w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-red-400 ${
                        errors.subCategory ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select</option>
                      {currentItem.mainCategory &&
                        getSubCategories(currentItem.mainCategory).map(subcat => (
                          <option key={subcat} value={subcat}>{subcat}</option>
                        ))
                      }
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Qty</label>
                    <input
                      type="number"
                      value={currentItem.quantity}
                      onChange={(e) => handleItemChange('quantity', e.target.value)}
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className={`w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-red-400 ${
                        errors.quantity ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Unit</label>
                    <select
                      value={currentItem.unit}
                      onChange={(e) => handleItemChange('unit', e.target.value)}
                      className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                      {UNITS.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Unit Price (₱)</label>
                    <input
                      type="number"
                      value={currentItem.unitPrice}
                      onChange={(e) => handleItemChange('unitPrice', e.target.value)}
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className={`w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-red-400 ${
                        errors.unitPrice ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  <div className="col-span-2 flex items-end">
                    <button
                      type="button"
                      onClick={addItemToList}
                      className="w-full px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                      <span className="mr-1">+</span>
                      Add to List
                    </button>
                  </div>
                </div>

                {currentItem.name && (
                  <div className="bg-yellow-100 border border-yellow-300 rounded p-2 mb-2">
                    <p className="text-sm font-medium text-yellow-800">Item: {currentItem.name}</p>
                  </div>
                )}

                {Object.keys(errors).length > 0 && (
                  <div className="text-red-600 text-sm">
                    {Object.values(errors).map((error, index) => (
                      <p key={index}>{error}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* Items Table */}
              <div className="mb-6">
                <h4 className="font-medium mb-3 text-red-700">Added Items ({items.length})</h4>
                {items.length === 0 ? (
                  <p className="text-gray-500 text-sm italic">No items added yet</p>
                ) : (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left font-medium text-gray-700">Item Name</th>
                            <th className="px-4 py-3 text-center font-medium text-gray-700 w-20">Qty</th>
                            <th className="px-4 py-3 text-center font-medium text-gray-700 w-16">Unit</th>
                            <th className="px-4 py-3 text-center font-medium text-gray-700 w-24">Unit Price</th>
                            <th className="px-4 py-3 text-center font-medium text-gray-700 w-24">Total</th>
                            <th className="px-4 py-3 text-center font-medium text-gray-700 w-20">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item, index) => (
                            <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium">{item.name}</td>
                              <td className="px-4 py-3 text-center">{item.quantity}</td>
                              <td className="px-4 py-3 text-center">{item.unit}</td>
                              <td className="px-4 py-3 text-center">₱{item.unitPrice.toFixed(2)}</td>
                              <td className="px-4 py-3 text-center font-medium">₱{(item.quantity * item.unitPrice).toFixed(2)}</td>
                              <td className="px-4 py-3 text-center">
                                <button
                                  onClick={() => removeItem(index)}
                                  className="text-red-600 hover:text-red-800 text-sm underline"
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-red-50">
                          <tr>
                            <td colSpan="4" className="px-4 py-3 text-right font-bold text-gray-700">TOTAL VALUE:</td>
                            <td className="px-4 py-3 text-center font-bold text-red-600 text-lg">₱{calculateTotal().toFixed(2)}</td>
                            <td></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  ← Back to Source
                </button>
                <div className="flex space-x-3">
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveTransaction}
                    disabled={items.length === 0 || isSubmitting}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center text-sm font-medium"
                  >
                    {isSubmitting && <div className="modern-spinner mr-2 w-4 h-4"></div>}
                    Save Transaction ({items.length} items)
                  </button>
                </div>
              </div>

              {errors.general && (
                <p className="text-red-600 text-sm mt-2">{errors.general}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddTransactionModal;