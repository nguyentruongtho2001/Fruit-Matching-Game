Khởi động project
b1: cd vào file api -> open terminal -> run câu lệnh " npm start"
b1.1: cd vào file client -> open terminal -> run câu lệnh " npm start"
Lưu ý:

- Sẽ chạy bằng 'ip-server' của máy, không run bằng localhost
  cho nên khi run cần lưu ý ví dụ mặc định khi run project sẽ auto chạy bằng localhost. Nên ta sẽ thay đoạn localhost = '192.168.x.x' (x: ip của bạn)
- copy+paste đường dẫn (192.168.x.x:3000) để thay thế trong đoạn

Line17: app.use(cors({ credentials: true, origin: "http://192.168.x.x:3000" }));

trong file index.js thư mục api
