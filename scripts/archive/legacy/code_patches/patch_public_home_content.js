const fs = require('fs');
let code = fs.readFileSync('src/js/ui/public-home.js', 'utf8');

const oldContent = `const INSTITUTION_LINES = [
  'Đây là không gian chính thức của gia tộc trên mạng: nơi những điều thuộc về gia tộc được ghi lại và giữ theo thời gian.',
  'Bên trong là những khoảng không gian dành riêng cho người trong nhà. Phần đó không mở ra cho người ngoài — và cũng không phải ai cũng cần thấy.'
];`;

const newContent = `const INSTITUTION_LINES = [
  '[DRAFT] Một dòng họ giữ nếp nhà, ký ức và câu chuyện qua nhiều thế hệ — từ những năm đầu định hình cho đến hôm nay. Ấn phẩm số này là nơi lưu giữ và kể lại hành trình ấy: từ MẠCH, ký ức tiền nhân, tư liệu còn lại, đến con người và nếp sống của dòng họ. Bản copy cuối sẽ được hoàn thiện khi nguồn tư liệu được xác minh.',
  'Gia phả hiện lưu giữ 228 nhân vật · 0 gia đình · 2 ghi chép ký ức. (số liệu thật, trình bày tiết chế — chi tiết nằm trong Gia phả)'
];`;

code = code.replace(oldContent, newContent);
fs.writeFileSync('src/js/ui/public-home.js', code);
