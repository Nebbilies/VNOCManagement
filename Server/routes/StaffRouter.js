const express = require('express');
const StaffController = require('../controllers/StaffController');
const checkRole = require('../middlewares/checkRole');

const router = express.Router();

// Apply middleware to all staff routes
router.use(checkRole);

// Admin-only check
const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

// Admin-only routes
router.post('/staff', requireAdmin, StaffController.addStaff);
router.delete('/staff/:id', requireAdmin, StaffController.removeStaff);
router.get('/staff', requireAdmin, StaffController.getAllStaff);

module.exports = router;
