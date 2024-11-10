# Stage 1: Build the Angular application
FROM node:latest as builder

# Set working directory in the container
RUN mkdir -p /app 
WORKDIR /app
COPY . .
# Copy package.json and package-lock.json
# COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files

# Build the Angular application for production
RUN npm run build --prod
# Stage 2: Serve the Angular app with Nginx
FROM nginx:alpine
COPY */default.conf /etc/nginx/conf.d/default.conf

# Copy the built Angular files from the build stage to NGINX
COPY --from=builder /app/dist/audio-sound-app /usr/share/nginx/html

# # Expose port 80 for NGINX
# EXPOSE 4200

# # Start NGINX
# CMD ["nginx", "-g", "daemon off;"]
