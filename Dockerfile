FROM node:22-alpine

WORKDIR /app

# เปิดใช้ Corepack และกำหนดเวอร์ชัน Yarn ที่ต้องการ
RUN corepack enable && corepack prepare yarn@4.10.3 --activate

# (ถ้าต้องใช้) ติดตั้งแพ็กเกจระบบเสริม
RUN apk add --no-cache curl

# คัดลอกไฟล์ที่มีผลกับ dependency ก่อน เพื่อให้ layer cache ทำงานได้ดี
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/ .yarn/

# ติดตั้ง dependencies (ล็อกตาม lockfile)
RUN yarn install --immutable

# คัดลอกซอร์สโค้ดที่เหลือ
COPY . .

# เพิ่ม ARG และใช้ตอน build
ARG VITE_MODE=production
RUN yarn build --mode ${VITE_MODE}

# สร้างไฟล์โปรดักชัน
# RUN yarn build

EXPOSE 5173

# รัน static server โดยไม่ต้องติดตั้ง global
CMD ["yarn", "dlx", "serve", "-s", "dist", "-l", "5173"]
