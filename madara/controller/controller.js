const UserModel = require('../modules/modelUsers');
const CategoryModel = require('../modules/modelCategory');
const CauseModel = require('../modules/modelCause');
const BusinessModel = require('../modules/modelBusiness');
const AlignwithModel = require('../modules/modelAlign');
const PromotionModel = require('../modules/modelPromotion');
const DonationModel = require('../modules/modelDonation');
const ContactModel = require('../modules/modelContact');

const util = require('./helper');
const jwt = require('jsonwebtoken');

const extractToken = (req) => req.headers.authorization.split(" ")[1];
const decodeToken = (token) => jwt.decode(token);

const getUserFromToken = async (token) => {
    const { userId } = decodeToken(token);
    return await UserModel.findById(userId);
};

// User Register
module.exports.createUser = async (req, res) => {
    try {
        const { email, username, name, bio, links, password } = req.body;

        const existingUser = await UserModel.find({
            $or: [
                { email: { $regex: email, $options: 'i' } },
                { username: { $regex: username, $options: 'i' } },
            ],
        });

        if (existingUser.length > 0) {
            return res.send({ success: false, message: "Username or Email already exists." });
        }

        const newUser = new UserModel({
            name,
            email,
            username,
            bio,
            links,
            password: util.hashPassword(password),
            role: "user",
        });

        const savedUser = await newUser.save();
        res.send({ success: true, message: "User registered successfully.", doc: savedUser });
    } catch (error) {
        console.error(error);
        res.send({ success: false, message: "Unknown error", error });
    }
};

// User Login
module.exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.send({ success: false, message: "Missing fields" });
        }

        const user = await UserModel.findOne({ username: { $regex: username, $options: 'i' } });

        if (!user || !util.comparePassword(user.password, password)) {
            return res.send({ success: false, message: "Invalid username or password" });
        }

        const token = util.generateToken(user._id);
        res.send({ success: true, message: "Login successful", data: { user, token } });
    } catch (error) {
        console.error("DB Error", error);
        res.send({ success: false, message: "DB error", error });
    }
};

// Update User
module.exports.updateUser = async (req, res) => {
    try {
        const token = extractToken(req);
        const user = await getUserFromToken(token);

        if (!user) {
            return res.send({ success: false, message: "Please login again." });
        }

        const { name, bio, links } = req.body;
        const filePath = req.file ? req.file.path : null;

        Object.assign(user, { name, bio, links, image: filePath });

        const updatedUser = await user.save();
        res.send({ success: true, message: "User updated successfully", data: updatedUser });
    } catch (error) {
        console.error(error);
        res.send({ success: false, message: "Unknown error", error });
    }
};

// Get User
module.exports.getUser = async (req, res) => {
    try {
        const token = extractToken(req);
        const user = await getUserFromToken(token);

        if (!user) {
            return res.send({ success: false, message: "Please login again." });
        }

        res.send({ success: true, message: "User retrieved successfully", data: user });
    } catch (error) {
        console.error(error);
        res.send({ success: false, message: "Unknown error", error });
    }
};

// Create Category
module.exports.createCategory = async (req, res) => {
    try {
        const token = extractToken(req);
        const user = await getUserFromToken(token);

        if (!user || user.role !== "admin") {
            return res.send({ success: false, message: "Please login again." });
        }

        const newCategory = new CategoryModel({ name: req.body.name });
        const savedCategory = await newCategory.save();

        res.send({ success: true, message: "Category saved successfully", data: savedCategory });
    } catch (error) {
        console.error(error);
        res.send({ success: false, message: "Unknown error", error });
    }
};

// Get Categories
module.exports.getCategory = async (req, res) => {
    try {
        const categories = await CategoryModel.find({});
        res.send({ success: true, message: "Categories retrieved successfully", data: categories });
    } catch (error) {
        console.error(error);
        res.send({ success: false, message: "Unknown error", error });
    }
};

// Create Cause
module.exports.createCause = async (req, res) => {
    try {
        const { title, description, categoryId } = req.body;
        const image = req.file.path;

        const newCause = new CauseModel({ title, description, categoryId, image });
        const savedCause = await newCause.save();

        res.send({ success: true, message: "Cause saved successfully", data: savedCause });
    } catch (error) {
        console.error(error);
        res.send({ success: false, message: "Unknown error", error });
    }
};

// Get Causes
module.exports.getCause = async (req, res) => {
    try {
        const causes = await CauseModel.find({ isDeleted: false }).populate('categoryId');
        res.send({ success: true, message: "Causes retrieved successfully", data: causes });
    } catch (error) {
        console.error(error);
        res.send({ success: false, message: "Unknown error", error });
    }
};

// Get Causes for Users
module.exports.getCauseForUser = async (req, res) => {
    try {
        const causes = await CauseModel.find({ isDeleted: false, status: "Approved" }).populate('categoryId');
        res.send({ success: true, message: "Causes retrieved successfully", data: causes });
    } catch (error) {
        console.error(error);
        res.send({ success: false, message: "Unknown error", error });
    }
};

// Update Cause
module.exports.updateCause = async (req, res) => {
    try {
        const token = extractToken(req);
        const user = await getUserFromToken(token);

        if (!user || user.role !== "admin") {
            return res.send({ success: false, message: "Please login again." });
        }

        const cause = await CauseModel.findById(req.params.Id);
        if (!cause) {
            return res.send({ success: false, message: "Cause not found." });
        }

        cause.status = req.body.status;
        const updatedCause = await cause.save();

        res.send({ success: true, message: "Cause updated successfully", data: updatedCause });
    } catch (error) {
        console.error(error);
        res.send({ success: false, message: "Unknown error occurred", error });
    }
};

// Delete Cause
module.exports.deleteCause = async (req, res) => {
    try {
        const token = extractToken(req);
        const user = await getUserFromToken(token);

        if (!user || user.role !== "admin") {
            return res.send({ success: false, message: "Please login again." });
        }

        const cause = await CauseModel.findById(req.params.Id);
        if (!cause) {
            return res.send({ success: false, message: "Cause not found." });
        }

        cause.isDeleted = true;
        const updatedCause = await cause.save();

        res.send({ success: true, message: "Cause deleted successfully", data: updatedCause });
    } catch (error) {
        console.error(error);
        res.send({ success: false, message: "Unknown error occurred", error });
    }
};

// Create Business
module.exports.createBusiness = async (req, res) => {
    try {
        const token = extractToken(req);
        const user = await getUserFromToken(token);

        if (!user || user.role !== "admin") {
            return res.send({ success: false, message: "Please login again." });
        }

        const newBusiness = new BusinessModel({
            name: req.body.name,
            description: req.body.description,
        });

        const savedBusiness = await newBusiness.save();
        res.send({ success: true, message: "Business saved successfully", data: savedBusiness });
    } catch (error) {
        console.error(error);
        res.send({ success: false, message: "Unknown error", error });
    }
};

// Get Businesses
module.exports.getBusiness = async (req, res) => {
    try {
        const businesses = await BusinessModel.find({});
        res.send({ success: true, message: "Businesses retrieved successfully", data: businesses });
    } catch (error) {
        console.error(error);
        res.send({ success: false, message: "Unknown error", error });
    }
};

// Create Promotion
module.exports.createPromotion = async (req, res) => {
    try {
        const token = extractToken(req);
        const user = await getUserFromToken(token);

        if (!user || user.role !== "admin") {
            return res.send({ success: false, message: "Please login again." });
        }

        const newPromotion = new PromotionModel({
            title: req.body.title,
            description: req.body.description,
            businessId: req.body.businessId,
        });

        const savedPromotion = await newPromotion.save();
        res.send({ success: true, message: "Promotion saved successfully", data: savedPromotion });
    } catch (error) {
        console.error(error);
        res.send({ success: false, message: "Unknown error", error });
    }
};

// Get Promotions
module.exports.getPromotion = async (req, res) => {
    try {
        const promotions = await PromotionModel.find({ isDeleted: false });
        res.send({ success: true, message: "Promotions retrieved successfully", data: promotions });
    } catch (error) {
        console.error(error);
        res.send({ success: false, message: "Unknown error", error });
    }
};

// Delete Promotion
module.exports.deletePromotion = async (req, res) => {
    try {
        const token = extractToken(req);
        const user = await getUserFromToken(token);

        if (!user || user.role !== "admin") {
            return res.send({ success: false, message: "Please login again." });
        }

        const promotion = await PromotionModel.findById(req.params.Id);
        if (!promotion) {
            return res.send({ success: false, message: "Promotion not found." });
        }

        promotion.isDeleted = true;
        const updatedPromotion = await promotion.save();

        res.send({ success: true, message: "Promotion deleted successfully", data: updatedPromotion });
    } catch (error) {
        console.error(error);
        res.send({ success: false, message: "Unknown error occurred", error });
    }
};

// Create Alignment
module.exports.createAlignment = async (req, res) => {
    try {
        const token = extractToken(req);
        const user = await getUserFromToken(token);

        if (!user || user.role !== "admin") {
            return res.send({ success: false, message: "Please login again." });
        }

        const newAlign = new AlignwithModel({
            causeId: req.body.causeId,
            businessId: req.body.businessId,
        });

        const savedAlign = await newAlign.save();
        res.send({ success: true, message: "Alignment saved successfully", data: savedAlign });
    } catch (error) {
        console.error(error);
        res.send({ success: false, message: "Unknown error", error });
    }
};

// Get Alignments
module.exports.getAlignment = async (req, res) => {
    try {
        const alignments = await AlignwithModel.find({}).populate('causeId').populate('businessId');
        res.send({ success: true, message: "Alignments retrieved successfully", data: alignments });
    } catch (error) {
        console.error(error);
        res.send({ success: false, message: "Unknown error", error });
    }
};

// Create Donation
module.exports.createDonation = async (req, res) => {
    try {
        const { causeId, amount, userId } = req.body;

        const newDonation = new DonationModel({
            userId,
            causeId,
            amount,
        });

        const savedDonation = await newDonation.save();
        res.send({ success: true, message: "Donation saved successfully", data: savedDonation });
    } catch (error) {
        console.error(error);
        res.send({ success: false, message: "Unknown error", error });
    }
};

// Get Donations
module.exports.getDonation = async (req, res) => {
    try {
        let filter = {}
        if (req.params.Id != 'null') {
            filter = { userId: req.params.Id }
        }
        const donations = await DonationModel.find(filter).populate('userId').populate('causeId');
        res.send({ success: true, message: "Donations retrieved successfully", data: donations });
    } catch (error) {
        console.error(error);
        res.send({ success: false, message: "Unknown error", error });
    }
};

// Contact US
module.exports.createContact = async (req, res) => {
    try {
        const { firstName, lastName, email, message } = req.body;

        const existingContact = await ContactModel.find({ email: { $regex: email, $options: 'i' } });

        if (existingContact.length > 0) {
            return res.send({ success: false, message: "Your query is already submitted" });
        }

        const newContact = new ContactModel({
            firstName,
            lastName,
            email,
            message
        });

        const savedContact = await newContact.save();
        res.send({ success: true, message: "Contact registered successfully.", doc: savedContact });
    } catch (error) {
        res.send({ success: false, message: "Unknown error", error });
    }
};


// Get Contact
module.exports.getContact = async (req, res) => {
    try {
        const contact = await ContactModel.find({});
        res.send({ success: true, message: "Contact retrieved successfully", data: contact });
    } catch (error) {
        res.send({ success: false, message: "Unknown error", error });
    }
};