const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Product = require('../models/Product');
const multer = require('multer');

// 파일 업로드 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({ storage: storage }).single('file');

// 이미지 업로드
router.post('/image', auth, async (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).send(err);
        }
        return res.json({ fileName: res.req.file.filename });
    });
});

// 특정 상품 조회 (조회수 카운트 추가)
router.get('/:id', async (req, res, next) => {
    const type = req.query.type;
    let productIds = req.params.id;

    if (type === 'array') {
        const ids = productIds.split(',');
        productIds = ids.map((item) => item);
    }

    try {
        const products = await Product.find({ _id: { $in: productIds } }).populate('writer');

        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // 조회수 증가 처리
        const updatePromises = products.map(async (product) => {
            product.views = (product.views || 0) + 1; // views가 없는 경우 0으로 초기화
            await product.save();
            console.log(`[조회수 업데이트] Product ID: ${product._id}, Title: ${product.title}, Views: ${product.views}`);
        });

        await Promise.all(updatePromises);

        return res.status(200).send(products);
    } catch (error) {
        console.error('상품 조회 중 오류 발생:', error.message);
        next(error);
    }
});

// 전체 상품 조회
router.get('/', async (req, res, next) => {
    const order = req.query.order ? req.query.order : 'desc';
    const sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    const limit = req.query.limit ? Number(req.query.limit) : 20;
    const skip = req.query.skip ? Number(req.query.skip) : 0;
    const term = req.query.searchTerm;

    let findArgs = {};
    for (let key in req.query.filters) {
        if (req.query.filters[key].length > 0) {
            if (key === 'price') {
                findArgs[key] = {
                    $gte: req.query.filters[key][0],
                    $lte: req.query.filters[key][1],
                };
            } else {
                findArgs[key] = req.query.filters[key];
            }
        }
    }

    if (term) {
        findArgs['$text'] = { $search: term };
    }

    try {
        const products = await Product.find(findArgs)
            .populate('writer')
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit);

        const productsTotal = await Product.countDocuments(findArgs);
        const hasMore = skip + limit < productsTotal;

        return res.status(200).json({
            products,
            hasMore,
        });
    } catch (error) {
        next(error);
    }
});

// 상품 생성
router.post('/', auth, async (req, res, next) => {
    try {
        const product = new Product(req.body);
        product.save();
        return res.sendStatus(201);
    } catch (error) {
        next(error);
    }
});

// 상품 삭제
router.delete('/:id', auth, async (req, res) => {
    try {
        const user = req.user
        if (!user || user.role !== 1) {
            return res.status(403).json({ message: 'Permission denied' })
        }

        const product = await Product.findByIdAndDelete(req.params.id)
        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        res.status(200).json({ message: 'Product deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete product' })
    }
})

// 조회수 데이터 조회
router.get('/products/views', async (req, res) => {
    try {
        console.log('요청 수신 - /products/views')
        const products = await Product.find({}, { title: 1, views: 1 })
        console.log('조회된 데이터:', products)
        res.status(200).json(products)
    } catch (error) {
        console.error('상품 조회 중 오류 발생:', error.message)
        res.status(500).json({ error: error.message })
    }
})

module.exports = router;
