const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware')
const { getDonorListController, getHospitalListController, getOrgListController, deleteDonorController } = require('../controllers/adminController');
const adminMiddleware = require('../middlewares/adminMiddleware');

const router = express.Router();

router.get('/donor-list', authMiddleware,
    adminMiddleware,
    getDonorListController
)

router.get('/hospital-list', authMiddleware,
    adminMiddleware,
    getHospitalListController
)

router.get('/Org-list', authMiddleware,
    adminMiddleware,
    getOrgListController
)



router.delete('/delete-donor/:id', authMiddleware, adminMiddleware, deleteDonorController)

module.exports = router;


