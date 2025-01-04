const { default: mongoose, Schema } = require("mongoose");

const productSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        maxLength: 100000
    },
    description: String,
    price: {
        type: Number
    },
    images: {
        type: Array,
        default: []
    },
    sold: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    quantity: { // 추가된 필드
        type: Number,
        required: true,
        default: 0, // 기본값 설정
        min: [0, 'Quantity cannot be negative'] // 유효성 검사
    }
});

productSchema.index({
    title: 'text',
    description: 'text'
}, {
    weights: {
        title: 5
    }
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
