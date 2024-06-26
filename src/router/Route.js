const router = require('express').Router();
const Handler = require('../controller/controller');

const jwt = require('jsonwebtoken');
const myEnv = require('dotenv').config();

const SECRET = "jua.g9Cy@$1J0R?R%$AWgesC7z.,e^R_-66PKK}vc?t'nZOM|YZLH#(bZ~a[O.C"

const path = require('path');
var multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },

    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

var upload = multer({ storage: storage });

function validateToken(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        return res.send({ success: false, statusCode: 404, message: 'Token missing' });
    }
    TokenArray = token.split(" ");
    jwt.verify(TokenArray[1], SECRET, (err, decoded) => {
        if (err) {
            return res.send({ success: false, statusCode: 404, message: 'Invalid token' });
        }
        req.user = decoded; // Store the decoded user information in the request
        next(); // Move to the next middleware/route
    });
}

// routes
router.post('/register', upload.none(), Handler.register);

router.post('/login', upload.none(), Handler.login);

router.post('/createCategory', validateToken, upload.none(), Handler.createCategory);

router.get('/getCategory', Handler.getCategory);

router.post('/createCause', upload.single('image'), Handler.createCause);

router.get('/getCause', Handler.getCause);

router.get('/getCauseForUser', Handler.getCauseForUser);

router.put('/updateCause/:Id', validateToken, upload.none(), Handler.updateCause);

router.delete('/deleteCause/:Id', validateToken, upload.none(), Handler.deleteCause);

router.post('/createBusiness', validateToken, upload.none(), Handler.createBusiness);

router.get('/getBusiness', Handler.getBusiness);

router.post('/createPromotion', validateToken, upload.none(), Handler.createPromotion);

router.get('/getPromotion', Handler.getPromotion);

router.delete('/deletePromotion/:Id', validateToken, upload.none(), Handler.deletePromotion);

router.post('/createAlignwith', validateToken, upload.none(), Handler.createAlignwith);

router.get('/getAlignwith', Handler.getAlignwith);

router.post('/createDonation', upload.none(), Handler.createDonation);

router.get('/getDonation', Handler.getDonation);


module.exports = router;