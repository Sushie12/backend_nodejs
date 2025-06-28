const vendorController=require('../controller/vendorController');
const express=require('express');

const router=express.Router();

router.post('/register',vendorController.vendorRegister);
router.post('/login',vendorController.vendorLogin);
router.get('/single-vendor/:id',vendorController.getVendorById)

module.exports=router;

