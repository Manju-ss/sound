#Download Node Alpine image
FROM amazonlinux:latest As build
 
RUN yum update -y && \
    curl -sL https://rpm.nodesource.com/setup_20.x | bash - && \
    yum install -y nodejs
#Setup the working directory
WORKDIR /usr/src/app
 
#Copy package.json
COPY package.json package-lock.json ./
 
#Install dependencies
RUN npm install -g @angular/cli
RUN npm install
 
#Copy other files and folder to working directory
COPY . .
 
#Build Angular application in PROD mode
RUN ng build --configuration production
 
#Download NGINX Image
FROM amazonlinux:latest
 
#Copy built angular app files to NGINX HTML folder
COPY --from=build /usr/src/app/dist/audio-sound-app/ /usr/src/app

WORKDIR /usr/src/app

# Expose port 4200
EXPOSE 4200

# Serve the application on port 4200
CMD ["serve", "-s", ".", "-l", "4200"]