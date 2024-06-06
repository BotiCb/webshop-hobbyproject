
const express = require('express');
const router = express.Router();
const productController = require('../Controllers/productController');




router.get('/gender/:pgender', productController.getProductsbyGender);

router.get('/genderandcategory/:gender/:category',  productController.getProductsbyGenderandCategory);

router.get('/product/:ID', productController.getProductById);
router.get('/categories/:gender', productController.getProductCategoriesByGender);
router.get('/search/:keyword', productController.getSearchedProducts);
router.get('/gender/:gender/search/:keyword', productController.getSearchedProductsbyGender);
router.get('/gender/:gender/category/:category/search/:keyword', productController.getSearchedProductsbyGenderandCategory);





module.exports = router;
