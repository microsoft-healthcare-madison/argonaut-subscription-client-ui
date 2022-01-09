FROM node:10 as builder
WORKDIR /app
COPY ./package*.json ./
COPY ./src ./src
COPY ./fhir4 ./fhir4
COPY ./fhir5 ./fhir5
COPY ./public ./public

RUN npm install
RUN npm run-script build

FROM nginx:alpine
COPY --from=builder /app/build/ /usr/share/nginx/html/
