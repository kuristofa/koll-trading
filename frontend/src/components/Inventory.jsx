import { useEffect, useState } from 'react';
import AddTransactionModal from './AddTransactionModal';
import { transactionService } from '../services/transactionService';

export default function Inventory() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch existing transactions on mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedTransactions = await transactionService.getAllTransactions();
      setTransactions(fetchedTransactions);
    } catch (err) {
      setError('Failed to load inventory transactions. Please try again.');
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransactionAdded = (newTransaction) => {
    setTransactions((prev) => [newTransaction, ...prev]); // Add to beginning for newest first
    setError(null);
  };

  const handleDeleteTransaction = async (transaction) => {
    try {
      await transactionService.deleteTransaction(transaction._id);
      setTransactions((prev) => prev.filter((t) => t._id !== transaction._id));
    } catch (err) {
      setError('Failed to delete transaction. Please try again.');
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-red-600 mb-2">Junkshop Inventory</h1>
          <p className="text-gray-700 font-medium">Transaction log of received items</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center shadow-lg"
        >
          <span className="mr-2">+</span>
          Add Transaction
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-300 rounded-lg p-4 shadow-sm">
          <div className="text-red-800 font-medium">{error}</div>
        </div>
      )}

      {/* Transactions as Bubbles/Cards */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="modern-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transactions...</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl text-gray-300 mb-4">📦</div>
          <p className="text-gray-600 text-lg">No transactions recorded yet.</p>
          <p className="text-gray-500 mt-2">Click "Add Transaction" to record your first inventory receipt.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transactions.map((transaction) => (
            <div
              key={transaction._id}
              className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 relative overflow-hidden"
            >
              {/* Bubble effect */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-red-100 rounded-full -mr-8 -mt-8 opacity-20"></div>

              {/* Header */}
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-red-700 text-xl mb-1 truncate">{transaction.source}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(transaction.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(transaction.date).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-2xl font-bold text-red-600">₱{transaction.totalValue.toFixed(2)}</div>
                    <div className="text-sm text-gray-600">{transaction.items.length} items</div>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Items Received:</div>
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {transaction.items.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex justify-between text-xs bg-gray-100 rounded px-2 py-1">
                        <span className="truncate flex-1">{item.name}</span>
                        <span className="text-gray-600 ml-2 whitespace-nowrap">
                          {item.quantity}{item.unit}
                        </span>
                      </div>
                    ))}
                    {transaction.items.length > 3 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{transaction.items.length - 3} more items
                      </div>
                    )}
                  </div>
                </div>

                {/* Transaction Info & Actions - Bottom */}
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">
                      Transaction #{transaction._id.slice(-6)}
                    </span>
                    <button
                      onClick={() => handleDeleteTransaction(transaction)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTransactionAdded={handleTransactionAdded}
      />
    </div>
  );
}
