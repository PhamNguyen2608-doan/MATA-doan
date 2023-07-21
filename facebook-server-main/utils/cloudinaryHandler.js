const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadToCloudinary = async (file, path) => {
  return new Promise((resolve, reject) => {
    if (file) {
      cloudinary.uploader
        .upload_stream({ folder: path }, (err, res) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            console.log(`Upload succeed: ${res}`);
            resolve(res);
          }
        })
        .end(file);
    } else {
      reject('No file provided');
    }
  });
};

exports.getImages = async (path, max, sort) => {
  return new Promise((resolve, reject) => {
    cloudinary.search
      .expression(`${path}`)
      .sort_by('created_at', `${sort}`)
      .max_results(max)
      .execute()
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.getPublicIdFromUrl = (url) => {
  const pathArray = url.split('/');
  const fileName = pathArray[pathArray.length - 1];
  const [publicId] = fileName.split('.');
  return publicId;
};

// exports.deleteImageFromCloudinary = async (publicId) => {
//   try {
//     const result = await cloudinary.uploader.destroy(publicId);
//     return result;
//   } catch (error) {
//     console.error('Error deleting image from Cloudinary:', error);
//     throw error;
//   }
// };
exports.deleteImageFromCloudinary = (publicId, callback) => {
  return cloudinary.api.delete_resources(publicId, callback);
};
