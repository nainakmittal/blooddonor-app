const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { createInventoryController, getInventoryController, getDonorsController, getHospitalsController, getOrganisationController, getOrganisationForHospitalController, getInventoryHospitalController, getRecentInventoryController } = require('../controllers/inventoryController');

const router = express.Router();


router.post("/create-inventory", authMiddleware,
    createInventoryController
);
router.get("/get-inventory", authMiddleware, getInventoryController);
router.get("/get-recent-inventory", authMiddleware, getRecentInventoryController);
router.post("/get-inventory-hospital", authMiddleware, getInventoryHospitalController);

router.get("/get-donors", authMiddleware, getDonorsController);
router.get("/get-hospitals", authMiddleware, getHospitalsController);
router.get("/get-organisation", authMiddleware, getOrganisationController);
router.get("/get-organisation-for-hospital", authMiddleware, getOrganisationForHospitalController);


module.exports = router;