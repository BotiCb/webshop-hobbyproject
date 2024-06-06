
const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const db = require('../OracleDatabase/connectdb');




router.post('/login', userController.login);
router.post('/register', userController.register);

router.post('/logout', userController.logout);

router.get("/orders", userController.getOrders);

router.get('/navbar', userController.navbar);

router.get('/shoppingcart', userController.getShoppingCart);
router.get('/favorites', userController.getFavorites);
router.post('/order', userController.order);
router.post('/updateShoppingcart', userController.updateShoppingCart);
router.post('/changePassword', userController.changePassword);




module.exports = router;
