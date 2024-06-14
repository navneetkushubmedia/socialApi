const LoginModel = require('../modules/login');
const CategoryModel = require('../modules/category');
const CauseModel = require('../modules/cause');
const BusinessModel = require('../modules/business');
const AlignwithModel = require('../modules/alignwith');
const PromotionModel = require('../modules/promotion');
const DonationModel = require('../modules/donation');

// Required Helper Function
const util = require('./util');
const jwt = require('jsonwebtoken');

const fs = require('fs');



//User Register
module.exports.register = async (req, res) => {
    try {
        LoginModel.find({
            $or: [
                {
                    email: {
                        $regex: req.body.email,
                        $options: 'i',
                    },
                },
                {
                    username: {
                        $regex: req.body.username,
                        $options: 'i',
                    },
                },
            ],
        }, function (err, docs) {
            if (err) {
                res.send({ error: err, success: false, message: "DB Error" });
            }
            else if (docs.length > 0) {
                res.send({ error: {}, success: false, message: "Username or Email already exsits." });
            }
            else {
                const createUser = new LoginModel({
                    name: req.body.name,
                    email: req.body.email,
                    username: req.body.username,
                    password: util.hashPassword(req.body.password),
                    role: "user",
                });
                createUser.save()
                    .then(doc => {
                        res.send({ doc, success: true, message: "User registered successfully." });
                    })
                    .catch(error => {
                        res.send({ error, success: false, message: "DB error in user register" });
                    })
            }
        });
    }
    catch (error) {
        console.log(error);
        res.send({ error, success: false, message: "Unknown error" });
    }
}

//Login
module.exports.login = (req, res) => {
    try {
        let { username, password } = req.body;
        if (!username || !password) return res.send({ success: false, message: "missing field/'s" });

        else {
            LoginModel.findOne({ username: { $regex: username, $options: 'i' } }).exec()
                .then(doc => {
                    if (!doc) return res.send({ data: {}, success: false, message: "No such user found" });

                    if (!util.comparePassword(doc.password, password)) {
                        return res.send({ data: {}, success: false, message: "Please enter correct password" });
                    }
                    else {
                        const token = util.generateToken(doc._id);

                        const data = { doc, token }
                        res.send({ data, success: true, message: "Login successfully." });
                    }
                })
                .catch(error => {
                    console.log("DB Error", error);
                    res.send({ error, success: false, message: "DB error" });
                })
        }
    }
    catch (error) {
        console.log("Error", error);
        res.send({ error, success: false, message: "unknown error" });
    }
};


// Create Category
module.exports.createCategory = async (req, res) => {
    try {
        const token = req.headers.authorization;
        TokenArray = token.split(" ");
        let { userId } = jwt.decode(TokenArray[1]);
        let user = await LoginModel.findOne({ _id: userId });
        if (!user._id || user.role != "admin") return res.send({ error: {}, success: false, message: "Please login in again." });

        const newCategory = new CategoryModel({
            name: req.body.name
        });

        const savedCategory = await newCategory.save();
        return res.send({ data: savedCategory, success: true, message: "Category Saved Successfully" });
    }
    catch (error) {
        console.log("Error", error)
        res.send({ error, success: false, message: "Unknown error" });
    }
}

// Get Category
module.exports.getCategory = async (req, res) => {
    try {
        // const token = req.headers.authorization;
        // TokenArray = token.split(" ");
        // let { userId } = jwt.decode(TokenArray[1]);
        // let user = await LoginModel.findOne({ _id: userId });
        // if (!user._id || user.role != "admin") return res.send({ error: {}, success: false, message: "Please login in again." });

        const categoryData = await CategoryModel.find({});

        res.send({ doc: categoryData, success: true, message: "Catogries get successfully" });
    }
    catch (error) {
        res.send({ error, success: false, message: "Unknown error" });
    }
}

// Create Cause
module.exports.createCause = async (req, res) => {
    try {
        const token = req.headers.authorization;
        TokenArray = token.split(" ");
        let { userId } = jwt.decode(TokenArray[1]);
        let user = await LoginModel.findOne({ _id: userId });
        if (!user._id || user.role != "admin") return res.send({ error: {}, success: false, message: "Please login in again." });

        const newCause = new CauseModel({
            title: req.body.title,
            description: req.body.description,
            categoryId: req.body.categoryId,
            image: req.file.path,
        });

        const savedCause = await newCause.save();
        return res.send({ data: savedCause, success: true, message: "Cause Saved Successfully" });
    }
    catch (error) {
        console.log("Error", error)
        res.send({ error, success: false, message: "Unknown error" });
    }
}

// Get Cause
module.exports.getCause = async (req, res) => {
    try {
        const causeData = await CauseModel.find({ isDeleted: false }).populate('categoryId');

        res.send({ doc: causeData, success: true, message: "Causes get successfully" });
    }
    catch (error) {
        res.send({ error, success: false, message: "Unknown error" });
    }
}

// Get Cause For User
module.exports.getCauseForUser = async (req, res) => {
    try {
        const causeData = await CauseModel.find({ isDeleted: false, status: "Approved" }).populate('categoryId');

        res.send({ doc: causeData, success: true, message: "Causes get successfully" });
    }
    catch (error) {
        res.send({ error, success: false, message: "Unknown error" });
    }
}

//Update Cause
module.exports.updateCause = async (req, res) => {
    try {
        const token = req.headers.authorization;
        TokenArray = token.split(" ");
        let { userId } = jwt.decode(TokenArray[1]);
        let user = await LoginModel.findOne({ _id: userId });
        if (!user._id || user.role != "admin") return res.send({ error: {}, success: false, message: "Please login in again." });


        let existingCause = await CauseModel.findOne({ _id: req.params.Id });

        existingCause.status = req.body.status;

        const updatedCause = await existingCause.save();
        return res.send({ data: updatedCause, success: true, message: "Cause updated successfully." });

    } catch (error) {
        res.send({ error, success: false, message: "Unknown error occurred." });
    }
}

//Delete Cause
module.exports.deleteCause = async (req, res) => {
    try {
        const token = req.headers.authorization;
        TokenArray = token.split(" ");
        let { userId } = jwt.decode(TokenArray[1]);
        let user = await LoginModel.findOne({ _id: userId });
        if (!user._id || user.role != "admin") return res.send({ error: {}, success: false, message: "Please login in again." });


        let existingCause = await CauseModel.findOne({ _id: req.params.Id });

        existingCause.isDeleted = true;

        const updatedCause = await existingCause.save();
        return res.send({ data: updatedCause, success: true, message: "Cause deleted successfully." });

    } catch (error) {
        res.send({ error, success: false, message: "Unknown error occurred." });
    }
}

// Create Business
module.exports.createBusiness = async (req, res) => {
    try {
        const token = req.headers.authorization;
        TokenArray = token.split(" ");
        let { userId } = jwt.decode(TokenArray[1]);
        let user = await LoginModel.findOne({ _id: userId });
        if (!user._id || user.role != "admin") return res.send({ error: {}, success: false, message: "Please login in again." });

        const newBusiness = new BusinessModel({
            name: req.body.name,
            description: req.body.description
        });

        const savedBusiness = await newBusiness.save();
        return res.send({ data: savedBusiness, success: true, message: "Business Saved Successfully" });
    }
    catch (error) {
        console.log("Error", error)
        res.send({ error, success: false, message: "Unknown error" });
    }
}

// Get Business
module.exports.getBusiness = async (req, res) => {
    try {
        const token = req.headers.authorization;
        TokenArray = token.split(" ");
        let { userId } = jwt.decode(TokenArray[1]);
        let user = await LoginModel.findOne({ _id: userId });
        if (!user._id || user.role != "admin") return res.send({ error: {}, success: false, message: "Please login in again." });

        const businessData = await BusinessModel.find({});

        res.send({ doc: businessData, success: true, message: "Business get successfully" });
    }
    catch (error) {
        res.send({ error, success: false, message: "Unknown error" });
    }
}

// Create Promotion
module.exports.createPromotion = async (req, res) => {
    try {
        const token = req.headers.authorization;
        TokenArray = token.split(" ");
        let { userId } = jwt.decode(TokenArray[1]);
        let user = await LoginModel.findOne({ _id: userId });
        if (!user._id || user.role != "admin") return res.send({ error: {}, success: false, message: "Please login in again." });

        const newPromotion = new PromotionModel({
            title: req.body.title,
            description: req.body.description,
            businessId: req.body.businessId,
        });

        const savedPromotion = await newPromotion.save();
        return res.send({ data: savedPromotion, success: true, message: "Promotion Saved Successfully" });
    }
    catch (error) {
        console.log("Error", error)
        res.send({ error, success: false, message: "Unknown error" });
    }
}

// Get Promotion
module.exports.getPromotion = async (req, res) => {
    try {
        const token = req.headers.authorization;
        TokenArray = token.split(" ");
        let { userId } = jwt.decode(TokenArray[1]);
        let user = await LoginModel.findOne({ _id: userId });
        if (!user._id || user.role != "admin") return res.send({ error: {}, success: false, message: "Please login in again." });

        const promotionData = await PromotionModel.find({ isDeleted: false }).populate('businessId');

        res.send({ doc: promotionData, success: true, message: "Promotion get successfully" });
    }
    catch (error) {
        res.send({ error, success: false, message: "Unknown error" });
    }
}

//Delete Promotion
module.exports.deletePromotion = async (req, res) => {
    try {
        const token = req.headers.authorization;
        TokenArray = token.split(" ");
        let { userId } = jwt.decode(TokenArray[1]);
        let user = await LoginModel.findOne({ _id: userId });
        if (!user._id || user.role != "admin") return res.send({ error: {}, success: false, message: "Please login in again." });


        let existingPromotion = await PromotionModel.findOne({ _id: req.params.Id });

        existingPromotion.isDeleted = true;

        const updatedPromotion = await existingPromotion.save();
        return res.send({ data: updatedPromotion, success: true, message: "Promotion deleted successfully." });

    } catch (error) {
        res.send({ error, success: false, message: "Unknown error occurred." });
    }
}

// Create Alignwith
module.exports.createAlignwith = async (req, res) => {
    try {
        const token = req.headers.authorization;
        TokenArray = token.split(" ");
        let { userId } = jwt.decode(TokenArray[1]);
        let user = await LoginModel.findOne({ _id: userId });
        if (!user._id || user.role != "admin") return res.send({ error: {}, success: false, message: "Please login in again." });

        const newAlignwith = new AlignwithModel({
            causeId: req.body.causeId,
            businessId: req.body.businessId,
        });

        const savedAlignwith = await newAlignwith.save();
        return res.send({ data: savedAlignwith, success: true, message: "Alignwith Saved Successfully" });
    }
    catch (error) {
        console.log("Error", error)
        res.send({ error, success: false, message: "Unknown error" });
    }
}

// Get Alignwith
module.exports.getAlignwith = async (req, res) => {
    try {
        const token = req.headers.authorization;
        TokenArray = token.split(" ");
        let { userId } = jwt.decode(TokenArray[1]);
        let user = await LoginModel.findOne({ _id: userId });
        if (!user._id || user.role != "admin") return res.send({ error: {}, success: false, message: "Please login in again." });

        const alignWithData = await AlignwithModel.find({}).populate('businessId').populate('causeId');

        res.send({ doc: alignWithData, success: true, message: "Alignwith get successfully" });
    }
    catch (error) {
        res.send({ error, success: false, message: "Unknown error" });
    }
}


// Create Donation
module.exports.createDonation = async (req, res) => {
    try {
        const newDonation = new DonationModel({
            amount: req.body.amount,
            causeId: req.body.causeId,
            userId: req.body.userId,
        });

        const savedDonation = await newDonation.save();
        return res.send({ data: savedDonation, success: true, message: "Donation Saved Successfully" });
    }
    catch (error) {
        console.log("Error", error)
        res.send({ error, success: false, message: "Unknown error" });
    }
}

// Get Donation
module.exports.getDonation = async (req, res) => {
    try {
        const token = req.headers.authorization;
        TokenArray = token.split(" ");
        let { userId } = jwt.decode(TokenArray[1]);
        let user = await LoginModel.findOne({ _id: userId });
        if (!user._id || user.role != "admin") return res.send({ error: {}, success: false, message: "Please login in again." });

        const donationData = await DonationModel.find({}).populate('userId').populate('causeId');

        res.send({ doc: donationData, success: true, message: "Donation get successfully" });
    }
    catch (error) {
        res.send({ error, success: false, message: "Unknown error" });
    }
}