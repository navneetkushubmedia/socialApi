const router = require('express').Router();
const Handler = require('../controller/controller');

const jwt = require('jsonwebtoken');

const SECRET = "jua.g9Cy@$1J0R?R%$AWgesC7z.,e^R_-66PKK}vc?t'nZOM|YZLH#(bZ~a[O.C"

const path = require('path');
var multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './files/');
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
router.post('/createUser', upload.none(), Handler.createUser);

router.post('/loginUser', upload.none(), Handler.loginUser);

router.post('/updateUser', validateToken, upload.single('image'), Handler.updateUser);

router.get('/getUser', validateToken, Handler.getUser);

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

router.post('/createAlignwith', validateToken, upload.none(), Handler.createAlignment);

router.get('/getAlignwith', Handler.getAlignment);

router.post('/createDonation', upload.none(), Handler.createDonation);

router.get('/getDonation/:Id', Handler.getDonation);

router.post('/createContact', upload.none(), Handler.createContact);

router.get('/getContact', Handler.getContact);


module.exports = router;