#BASE IMAGE 
FROM node:20

#WORKING DIRECTORY OF CONTAINER
WORKDIR /app

#COPY package.json file to current working directory in container which is /app
COPY package.json .

#Install all npm packages
# RUN npm install

# Embeded bash script to run different npm install command as per environment
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
       then npm install; \
       else npm install --omit=dev; \
       fi

#COPY all the files and folder from current working directory to the container current working directory
COPY . ./

#Default env variable
ENV PORT=3000

#Expose the port - it's only for documentation purpose or someone which is work later to know the port
EXPOSE $PORT

#COMMAND to run the app in development mode
CMD ["node","index.js"]





# #BASE IMAGE 
# FROM node:20

# #WORKING DIRECTORY OF CONTAINER
# WORKDIR /app

# #COPY package.json file to current working directory in container which is /app
# COPY package.json .

# #Install all npm packages
# RUN npm install

# #COPY all the files and folder from current working directory to the container current working directory
# COPY index.js /app/
# COPY src/ /app/src

# #Default env variable
# ENV PORT=3000

# #Expose the port - it's only for documentation purpose or someone which is work later to know the port
# EXPOSE $PORT

# #COMMAND to run the app in development mode
# CMD ["npm","run","dev"]