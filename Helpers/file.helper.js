const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");

const bucket = new S3Client(
    {
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_KEY
        }
    }
);

const attachments = ["pdf", "doc", "docx", "jpeg", "png"];

const location = multerS3({
    s3: bucket,
    acl: 'public-read',
    bucket: process.env.AWS_BUCKET,
    metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
        const randomName = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const ext = file.mimetype.split("/")[1];
        const fileName = `images/${req.query.path}/${file.fieldname}-${randomName}.${ext}`;
        req.fileName = fileName;
        cb(null, fileName);
    },


});

const multerFilter = (req, file, cb) => {
    if (!attachments.includes(file.mimetype.split("/")[1])) {
        req.fileValidationError = true;
        cb(null, false);
    } else cb(null, true);
};

const upload = multer({
    storage: location,
    fileFilter: multerFilter,
    limits: { fileSize: 2000000 },
});

const uploadFile = (fieldName) => upload.single(fieldName);

module.exports = uploadFile;
