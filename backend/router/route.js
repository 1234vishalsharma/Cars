const express = require('express');
const {add_car , delete_car , edit_car , get_car} = require('../controllers/CarController/car');
const { login, signup } = require('../controllers/Auth/auth');
const router = express.Router();

// user routes
router.post('/Login' , login);
router.post('/Signup' , signup);

// car routes
router.get('/list_car' , get_car);
router.put('/edit_car' , edit_car);
router.post('/add_car' , add_car);
router.delete('/delete_car' , delete_car);



module.exports = router;