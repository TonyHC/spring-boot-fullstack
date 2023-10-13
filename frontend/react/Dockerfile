FROM node:20.4.0-alpine
ARG api_base_url
ARG cloudinary_username
WORKDIR /app
COPY package*.json .
RUN npm i --silent
COPY . .
RUN echo "VITE_API_BASE_URL=${api_base_url}" > .env
RUN echo "VITE_CLOUDINARY_USERNAME=${cloudinary_username}" >> .env
EXPOSE 5173
CMD ["npm", "run", "dev"]