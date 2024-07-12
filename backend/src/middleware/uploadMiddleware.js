const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Đường dẫn tuyệt đối tới thư mục lưu trữ bên ngoài
const uploadDirectory = path.join(__dirname, '../../uploads');

// Kiểm tra và tạo thư mục nếu chưa tồn tại
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Cấu hình multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = uuidv4();
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

exports.upload = multer({ storage: storage });
