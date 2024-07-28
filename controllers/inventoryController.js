const mongoose = require('mongoose');
const inventoryModel = require('../models/inventoryModel');
const userModel = require('../models/userModel');

const createInventoryController = async (req, res) => {
    try {
        const { email } = req.body;

        // Find the user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }

        if (req.body.inventoryType === 'out') {
            const requestedBloodGroup = req.body.bloodGroup;
            const requestedQuantity = req.body.quantity;
            const organisation = new mongoose.Types.ObjectId(req.body.userId);

            const totalInRecords = await inventoryModel.aggregate([
                {
                    $match: {
                        organisation,
                        inventoryType: 'in',
                        bloodGroup: requestedBloodGroup
                    }
                },
                {
                    $group: {
                        _id: "$bloodGroup",
                        total: { $sum: "$quantity" }
                    }
                }
            ]);

            const totalIn = totalInRecords[0]?.total || 0;

            const totalOutRecords = await inventoryModel.aggregate([
                {
                    $match: {
                        organisation,
                        inventoryType: 'out',
                        bloodGroup: requestedBloodGroup
                    }
                },
                {
                    $group: {
                        _id: "$bloodGroup",
                        total: { $sum: "$quantity" }
                    }
                },
            ]);

            const totalOut = totalOutRecords[0]?.total || 0;

            const availableQuantity = totalIn - totalOut;

            if (availableQuantity < requestedQuantity) {
                return res.status(500).send({
                    success: false,
                    message: `Only ${availableQuantity}ML of ${requestedBloodGroup.toUpperCase()} is available`
                });
            }

            req.body.hospital = user._id;
        } else {
            req.body.donor = user?._id;

        }

        // Create and save the inventory record
        const inventory = new inventoryModel(req.body);
        await inventory.save();

        return res.status(201).send({
            success: true,
            message: 'New blood record added'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in creating inventory',
            error
        });
    }
};

const getInventoryController = async (req, res) => {
    try {
        const inventory = await inventoryModel
            .find({ organisation: req.body.userId })
            .populate("donor")
            .populate("hospital")
            .sort({ createdAt: -1 });

        return res.status(200).send({
            success: true,
            message: "All records fetched successfully",
            inventory
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in fetching all inventory records",
            error
        });
    }
};




const getInventoryHospitalController = async (req, res) => {
    try {
        const inventory = await inventoryModel
            .find(req.body.filters)
            .populate("donor")
            .populate("hospital")
            .populate("organisation")
            .sort({ createdAt: -1 });

        return res.status(200).send({
            success: true,
            message: "All hospital consumer records successfully",
            inventory
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in Get consumer inventory records",
            error
        });
    }
};

const getRecentInventoryController = async (req, res) => {
    try {
        const inventory = await inventoryModel.find({
            organisation: req.body.userId,

        }).limit(3).sort({ createdAt: -1 })
        return res.status(200).send({
            success: true,
            message: 'recent Inventory Data',
            inventory,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error In Recent Inventory API',
            error,
        })

    }
}




const getDonorsController = async (req, res) => {
    try {
        const organisation = req.body.userId;

        const donorId = await inventoryModel.distinct('donor', {
            organisation,
        });

        // console.log(donorId);
        const donors = await userModel.find({ _id: { $in: donorId } })


        return res.status(200).send({
            success: true,
            message: 'Donor Record Fetch Ssuccessfully',
            donors,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in Donor records',
            error
        })

    }

};

const getHospitalsController = async (req, res) => {
    try {

        const organisation = req.body.userId;
        const hospitalId = await inventoryModel.distinct('hospital', { organisation });

        const hospitals = await userModel.find({
            _id: { $in: hospitalId }
        })
        return res.status(200).send({
            success: true,
            message: 'Hospital Data Fetched Successfully',
            hospitals,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error In get Hospital API",
            error,
        })

    }
};


const getOrganisationController = async (req, res) => {
    try {
        const donor = req.body.userId;
        const orgId = await inventoryModel.distinct('organisation', { donor });
        const organisations = await userModel.find({
            _id: { $in: orgId }

        })
        return res.status(200).send({
            success: true,
            message: 'Org Data Fetched Successfully',
            organisations,

        });


    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in Org API',
            error,
        })

    }

};



const getOrganisationForHospitalController = async (req, res) => {
    try {
        const hospital = req.body.userId;
        const orgId = await inventoryModel.distinct('organisation', { hospital });
        const organisations = await userModel.find({
            _id: { $in: orgId }

        })
        return res.status(200).send({
            success: true,
            message: 'Hospital Org Data Fetched Successfully',
            organisations,

        });


    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in Hospital Org API',
            error,
        })

    }

};

module.exports = {
    createInventoryController, getInventoryController, getDonorsController, getHospitalsController, getOrganisationController, getOrganisationForHospitalController,
    getInventoryHospitalController, getRecentInventoryController
};
