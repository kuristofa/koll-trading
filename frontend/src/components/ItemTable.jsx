import { useState } from 'react';

const ItemTable = ({ items, onEdit, onDelete, isLoading = false }) => {
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleDeleteClick = (item) => {
    setDeleteConfirm(item._id);
  };

  const handleDeleteConfirm = (item) => {
    onDelete(item);
    setDeleteConfirm(null);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-white to-yellow-100/5 rounded-xl shadow-lg border-2 border-yellow-300 p-6 transition-transform hover:-translate-y-1 hover:shadow-2xld">
        <div className="flex justify-center items-center p-8">
          <div className="w-6 h-6 border-4 border-yellow-300 border-t-red-500 rounded-full animate-spin"></div>
          <span className="ml-3 text-red-700 font-medium">Loading items<span className="modern-loading-dots"></span></span>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white to-yellow-100/5 rounded-xl shadow-lg border-2 border-yellow-300 p-6 transition-transform hover:-translate-y-1 hover:shadow-2xl">
        <div className="text-center p-8">
          <p className="text-lg font-bold text-red-600 animate-pulse-subtle">No items in inventory</p>
          <p className="text-gray-600 font-medium">Add your first item using the form.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-fit mx-auto p-6 rounded-xl border-2 border-red-300 bg-gradient-to-br from-white to-red-50/5 shadow-2xl overflow-x-auto overflow-y-auto h-full flex flex-col">
     <div className="px-6 py-4 bg-gradient-to-br from-white to-red-100/5 shadow-lg rounded-lg">
       <h3 className="text-xl font-bold text-red-600 animate-fade-in">
         Inventory Items ({items.length})
       </h3>
     </div>

     <div className="mt-4 flex-1 overflow-y-auto">
       <table className="table-auto border-collapse">
         <thead className="bg-gradient-to-r from-red-500 to-red-600 text-white">
           <tr>
             <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wide">
               Item Name
             </th>
             <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wide">
               Quantity
             </th>
             <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wide">
               Unit Price
             </th>
             <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wide">
               Total Value
             </th>
             <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wide">
               Category
             </th>
             <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wide">
               Actions
             </th>
           </tr>
         </thead>
         <tbody className="bg-white divide-y divide-yellow-200">
           {items.map((item) => (
             <tr key={item._id} className="hover:bg-yellow-50 transition-colors">
               <td className="px-6 py-4 whitespace-nowrap">
                 <div className="text-sm font-bold text-red-700">{item.name}</div>
               </td>
               <td className="px-6 py-4 whitespace-nowrap">
                 <div className="text-sm font-medium text-gray-800">
                   {item.quantity} {item.unit}
                 </div>
               </td>
               <td className="px-6 py-4 whitespace-nowrap">
                 <div className="text-sm font-medium text-gray-800">
                   ₱{item.unitPrice.toFixed(2)}
                 </div>
               </td>
               <td className="px-6 py-4 whitespace-nowrap">
                 <div className="text-sm font-bold text-red-600">
                   ₱{(item.quantity * item.unitPrice).toFixed(2)}
                 </div>
               </td>
               <td className="px-6 py-4 whitespace-nowrap">
                 <div className="text-sm font-medium text-gray-800">
                   <div className="font-bold text-red-700">{item.mainCategory}</div>
                   <div className="text-yellow-700 font-medium">{item.subCategory}</div>
                 </div>
               </td>
               <td className="px-6 py-4 whitespace-nowrap text-sm min-w-[120px]">
                 {deleteConfirm === item._id ? (
                   <div className="flex space-x-4">
                     <button
                       onClick={() => handleDeleteConfirm(item)}
                       className="bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-700 transition-colors shadow-sm"
                     >
                       Confirm
                     </button>
                     <button
                       onClick={handleDeleteCancel}
                       className="bg-gray-500 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-gray-600 transition-colors shadow-sm"
                     >
                       Cancel
                     </button>
                   </div>
                 ) : (
                   <div className="flex items-center justify-center space-x-4">
                     <button
                       onClick={() => onEdit(item)}
                       className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-yellow-600 transition-colors shadow-sm"
                     >
                       Edit
                     </button>
                     <button
                       onClick={() => handleDeleteClick(item)}
                       className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-600 transition-colors shadow-sm"
                     >
                       Delete
                     </button>
                   </div>
                 )}
               </td>
             </tr>
           ))}
         </tbody>
       </table>
     </div>

     {/* Summary section */}
     <div className="px-6 py-4 bg-yellow-50 border-t-2 border-yellow-300 rounded-b-lg mt-4">
       <div className="flex justify-between items-center text-sm">
         <span className="text-red-700 font-bold">
           Total Items: <span className="font-bold text-lg">{items.length}</span>
         </span>
         <span className="text-red-700 font-bold">
           Total Value: <span className="font-bold text-xl text-red-600">
             ₱{items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0).toFixed(2)}
           </span>
         </span>
       </div>
     </div>
   </div>
  );
};

export default ItemTable;

