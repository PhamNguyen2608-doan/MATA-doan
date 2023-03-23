const axios = require('axios');
const UserIP = require('../models/userIPModel');

exports.getCountryByIP = async (req, res) => {
  try {
    const ipAddress =
      req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const response = await axios.get(`https://ipapi.co/${ipAddress}/json/`);

    if (response.data && response.data.country_name) {
      const country = response.data.country_name;

      // Lưu địa chỉ IP và thông tin người dùng vào cơ sở dữ liệu
      const userId = req.user._id; // Giả sử req.user là đối tượng người dùng hiện tại
      const newUserIP = new UserIP({ userId, ipAddress });
      await newUserIP.save();

      res.status(200).json({ country });
    } else {
      res
        .status(400)
        .json({ message: 'Không thể xác định quốc gia từ địa chỉ IP.' });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        message: 'Lỗi khi lấy thông tin quốc gia từ địa chỉ IP.',
        error,
      });
  }
};
