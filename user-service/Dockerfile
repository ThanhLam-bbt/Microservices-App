# Sử dụng base image Node.js
FROM node:18-alpine

# Tạo thư mục làm việc
WORKDIR /usr/src/app

# Sao chép package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép mã nguồn
COPY . .

# Expose port
EXPOSE 3000

# Lệnh để chạy ứng dụng
CMD [ "npm", "start" ]