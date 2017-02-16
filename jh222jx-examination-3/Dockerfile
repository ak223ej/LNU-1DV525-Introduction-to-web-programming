FROM node


RUN mkdir /app; cd /app
COPY . /app/
WORKDIR /app

RUN npm set progress=false && npm install gulp -g
