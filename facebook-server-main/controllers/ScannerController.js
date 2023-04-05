const mongoose = require('mongoose');
const User = require('../models/userModel');
const Friend = require('../models/friendsModel');
const Follow = require('../models/followModel');
const Post = require('../models/postModel');
const Report = require('../models/reportModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const { getImages, uploadToCloudinary } = require('../utils/cloudinaryHandler');
const multer = require('multer');
const sharp = require('sharp');

const ObjectId = mongoose.Types.ObjectId;

exports.PostScanner = catchAsync(async () => {
  const features = new APIFeatures(Post.find(), {
    limit: 10,
    sort: '-createdAt',
  })
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const posts = await features.query;

  const allImages = [];
 
  posts.forEach((post) => {
    console.log('post: ', post);
    if (post.images && post.images.length > 0) {
      allImages.push(...post.images);
    }
  });
 console.log('allImages: ', allImages);
  console.log('am bot');
});
