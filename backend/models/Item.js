import mongoose from 'mongoose';

const subcategories = {
    Bakal: ['Solid A', 'Solid B', 'Solid C', 'Assorted', 'Tapalodo', 'Pundido'],
    Others: ['Lata', 'Yero']
}

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: {
        type: String,
        enum: ['pcs', 'kg'],
        required: true
    },
    unitPrice: { type: Number, required: true },

    mainCategory: {
        type: String,
        enum: Object.keys(subcategories),
        required: true
    },

    subCategory: { 
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                return subcategories[this.mainCategory]?.includes(value);
    },
            message: props => `${props.value} is not a valid subcategory for ${this.mainCategory}`
        }
    },

    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
        required: false
    }

}, { timestamps: true });

export default mongoose.model('Item', itemSchema);