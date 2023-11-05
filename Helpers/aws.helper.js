const { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const client = new S3Client(
    {
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_KEY
        }
    }
);

/**
 * @description uploads the binary file on aws
 * @param {binary} file binary file 
 * @param {string} folder name
 * @param {string} optional unique string for file : nameId 
 * @returns 
 */
const uploadFile = (file, folder, nameId) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('file', file);
            let fileName = `${(folder).toLowerCase()}/${nameId || Math.floor(Math.random() * 1000000000)}-${(file.originalname).replaceAll(' ', '-')}`;
            let ContentType;
            if ((fileName.toLowerCase()).includes('.pdf')) ContentType = 'application/pdf';
            if ((fileName.toLowerCase()).includes('.jpeg') || (fileName.toLowerCase()).includes('.jpg')) ContentType = 'image/jpeg';
            if ((fileName.toLowerCase()).includes('.png')) ContentType = 'image/png';

            const command = new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET,
                Key: fileName,
                Body: file.buffer,
                ContentType: ContentType
            });
            await client.send(command);
            resolve(fileName);
        } catch (error) {
            reject(error);
        }
    })
}

/**
 * @description gets a temporary url for given key file
 * @param {string} your aws object key
 * @returns {string} encrypted file uri
 */
const getTempUrl = (key) => {
    return new Promise(async (resolve, reject) => {
        try {
            const command = new GetObjectCommand({
                Bucket: process.env.AWS_BUCKET,
                Key: key,
                ResponseContentDisposition: 'inline'
            });
            const url = await getSignedUrl(client, command, { expiresIn: 1800 });
            resolve(url);
        } catch (error) {
            reject(error);
        }
    })
}


module.exports = {
    uploadFile,
    getTempUrl
}