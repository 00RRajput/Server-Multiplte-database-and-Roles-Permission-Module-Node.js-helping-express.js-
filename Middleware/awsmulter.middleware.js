// const AWS = require('aws-sdk');
// const multer = require('multer');
// const multerS3 = require('multer-s3');

// AWS.config.update({
//   accessKeyId: 'AKIA4HZCFDBM74DNA7WY',
//   secretAccessKey: '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',
//   region: 'ap-south-1',
// });

// const s3 = new AWS.S3();


// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: 'fps-holisol',
//     key: function (req, file, cb) {
//         console.log(req.params);
//         console.log(req.params.folder);
//       const folderName = req.params.folder;
//       cb(null, `${folderName}/${file.originalname}`);
//     },
//   }),
// })
// module.exports = upload;