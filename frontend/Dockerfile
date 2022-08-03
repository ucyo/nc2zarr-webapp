# https://www.indellient.com/blog/how-to-dockerize-an-angular-application-with-nginx/

# Stage 1: Compile and Build angular codebase

# Use official node image as the base image
FROM node:16.15 as build

# Set the working directory
WORKDIR /usr/local/app

# Add the source code to app
COPY ./ /usr/local/app/

# Install all the dependencies
RUN npm install

# Generate the build of the application
RUN npm run build -- --prod


# Stage 2: Serve app with nginx server

# Use official nginx image as the base image
FROM nginx:latest

# Copy the build output to replace the default nginx contents.
COPY --from=build /usr/local/app/dist/nc2zarr-frontend /usr/share/nginx/html

RUN for f in main.*.js; do envsubst '$NC2ZARR_WEB_INTERFACE_URL,$NC2ZARR_CONTENT_URL' < $f | sponge $f; done

COPY /nginx.conf  /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80
