const userModel = require("../models/userModel");

const getDonorListController = async (req, res) => {


    try {
        const donorData = await userModel
            .find({ role: "donor" })
            .sort({ createdAt: -1 });

        return res.status(200).send({
            success: true,
            Totalcount: donorData.length,
            message: 'Donor List Fetched Successfully',
            donorData,

        })


    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in Donor List API',
            error,
        })

    }
};



const getHospitalListController = async (req, res) => {


    try {
        const hospitalData = await userModel
            .find({ role: "hospital" })
            .sort({ createdAt: -1 });

        return res.status(200).send({
            success: true,
            Totalcount: hospitalData.length,
            message: 'Hospital List Fetched Successfully',
            hospitalData,

        })


    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in Hospital List API',
            error,
        })

    }
};



const getOrgListController = async (req, res) => {


    try {
        const OrgData = await userModel
            .find({ role: "organisation" })
            .sort({ createdAt: -1 });

        return res.status(200).send({
            success: true,
            Totalcount: OrgData.length,
            message: 'Organisation List Fetched Successfully',
            OrgData,

        })


    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in Organisation List API',
            error,
        });




    }
};


const deleteDonorController = async (req, res) => {
    try {
        await userModel.findByIdAndDelete(req.params.id)
        return res.status(200).send({
            success: true,
            message: "Record Deleted successfully",

        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error while deleting',
            error,
        })

    }

};






module.exports = {
    getDonorListController, getHospitalListController, getOrgListController, deleteDonorController,

};