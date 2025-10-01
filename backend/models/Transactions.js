import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    source: {
        type: String,
        required: true,
        trim: true
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    }],
    date: {
        type: Date,
        default: Date.now
    },
    totalValue: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export default mongoose.model('Transaction', transactionSchema);