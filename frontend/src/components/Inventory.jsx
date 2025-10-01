import { useEffect, useState } from 'react';
import ItemForm from './ItemForm';
import ItemTable from './ItemTable';
import { itemService } from '../services/itemService';

export default function Inventory() {
  const [items, setItems] = useState([]);1
  const [editingItem, setEditingItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch existing items on mount
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedItems = await itemService.getAllItems();
      setItems(fetchedItems);
    } catch (err) {
      setError('Failed to load items. Please try again.');
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const newItem = await itemService.createItem(formData);
      setItems((prev) => [...prev, newItem]);
    } catch (err) {
      setError('Failed to add item. Please try again.');
      console.error('Add error:', err);
      throw err; // Re-throw to let ItemForm handle validation errors
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditItem = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const updatedItem = await itemService.updateItem(editingItem._id, formData);
      setItems((prev) =>
        prev.map((item) => (item._id === editingItem._id ? updatedItem : item))
      );
      setEditingItem(null);
    } catch (err) {
      setError('Failed to update item. Please try again.');
      console.error('Update error:', err);
      throw err; // Re-throw to let ItemForm handle validation errors
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async (item) => {
    try {
      await itemService.deleteItem(item._id);
      setItems((prev) => prev.filter((i) => i._id !== item._id));
    } catch (err) {
      setError('Failed to delete item. Please try again.');
      console.error('Delete error:', err);
    }
  };

  const handleFormSubmit = (formData) => {
    if (editingItem) {
      return handleEditItem(formData);
    } else {
      return handleAddItem(formData);
    }
  };

  const handleFormCancel = () => {
    setEditingItem(null);
    setError(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-2">Junkshop Inventory</h1>
        <p className="text-gray-700 font-medium">Manage your inventory items with ease</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-300 rounded-lg p-4 shadow-sm">
          <div className="text-red-800 font-medium">{error}</div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add/Edit Item Form */}
        <div className="lg:col-span-1 h-full">
          <ItemForm
            item={editingItem}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isLoading={isSubmitting}
          />
        </div>

        {/* Item Table */}
        <div className="lg:col-span-2 h-full">
          <ItemTable
            items={items}
            onEdit={setEditingItem}
            onDelete={handleDeleteItem}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
