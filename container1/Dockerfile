# Use the official Node.js image as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package.json package-lock.json /app/

# Install dependencies
RUN npm install

# Copy the application code to the container
COPY . /app/

# Expose the port on which the application will run
EXPOSE 3000

# Start the application
CMD ["node", "index.js"]
