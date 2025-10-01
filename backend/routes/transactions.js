import express from 'express';
import mongoose from 'mongoose';
import Transaction from '../models/Transactions.js';
import Item from '../models/Item.js';

const router = express.Router();

// Get all transactions
router.get('/', async (req, res) => {
    try {
        const transactions = await Transaction.find().populate('items');
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single transaction
router.get('/:id', async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id).populate('items');
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.json(transaction);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { source, items } = req.body;

        // Create the items first with transaction placeholder
        const itemsToInsert = items.map(item => ({ ...item, transaction: null }));
        const createdItems = await Item.insertMany(itemsToInsert, { session });

        // Calculate total value
        const totalValue = createdItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

        // Create transaction with item IDs
        const transaction = new Transaction({
            source,
            items: createdItems.map(item => item._id),
            totalValue
        });

        const savedTransaction = await transaction.save({ session });

        // Update items with transaction reference
        await Item.updateMany(
            { _id: { $in: createdItems.map(item => item._id) } },
            { transaction: savedTransaction._id },
            { session }
        );

        await session.commitTransaction();

        // Populate the items in the response
        await savedTransaction.populate('items');

        res.status(201).json(savedTransaction);
    } catch (err) {
        await session.abortTransaction();
        res.status(400).json({ message: err.message });
    } finally {
        session.endSession();
    }
});

// Update transaction (optional, for editing source or something)
router.put('/:id', async (req, res) => {
    try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('items');

        if (!updatedTransaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        res.json(updatedTransaction);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete transaction (and associated items?)
router.delete('/:id', async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Optionally delete associated items
        await Item.deleteMany({ _id: { $in: transaction.items } });

        await Transaction.findByIdAndDelete(req.params.id);
        res.json({ message: 'Transaction and associated items deleted' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;