const multer = require("multer");
const slugify = require("slugify");
const MulterGoogleCloudStorage = require("multer-cloud-storage");

const path = require("path");
/**
 * This is the default middleware for uploading
 * files. The memoryStore is used to obtain
 * a buffer in request a file
 * @type {Multer}
 */
const multerUpload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 30 * 1024 * 1024, // no larger than 30MB
	},
});

/**
 * This is the default middleware for uploading
 * files to disk.
 * @type {Multer}
 */
const multerDiskUpload = multer({
	storage: multer.diskStorage({
		destination(req, file, cb) {
			cb(null, "uploads/");
		},
		filename(req, file, cb) {
			const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
			cb(
				null,
				`${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
			);
		},
	}),
	limits: {
		fileSize: 30 * 1024 * 1024, // no larger than 30mb
	},
});

/**
 * You can define the path to keyFilename if you don't want
 * to use .env variable
 * @type {string}
 */
// const path =require 'path';
// const keyFilenamePath = path.resolve(
//   path.join(
//     __dirname,
//     './../config/gcloud/google-application-credentials.json',
//   ),
// );

/**
 * Multer to GCS middleware.
 * Follow the README.md instructions at .src/config/gcloud/README.md
 * and create a bucket in GCP and generate a JSON file
 * otherwise this middleware will not work
 * @type {Multer}
 */

//   const multerGCSUpload = multer({
// 	storage: new MulterGoogleCloudStorage({
// 		acl: "publicRead",
// 		autoRetry: true,
// 		bucket: process.env.GOOGLE_STORAGE_BUCKET_NAME, // bucket name
// 		destination: "main_upload_folder/", // folder destination in gcs
// 		projectId: process.env.GOOGLE_PROJECT_ID, // gcp project id
// 		keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS, // path to JSON
// 		filename: (req, file, cb) => {
// 			cb(null, slugify(file.originalname));
// 		},
// 	}),
// });

module.exports = {
	// multerGCSUpload,
	multerUpload,
	multerDiskUpload,
};
