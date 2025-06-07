const express = require('express');
const StaffController = require('../controllers/StaffController');
const checkRole = require('../middlewares/CheckRole');

const router = express.Router();

router.post('/add', checkRole, StaffController.addStaff);
router.delete('/remove/:id', checkRole, StaffController.removeStaff);
router.get('/all', StaffController.getAllStaff);

module.exports = router;
