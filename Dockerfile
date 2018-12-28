# Build the frontend separately.
FROM node:10 AS frontend
WORKDIR /source
COPY Web/*.json Web/webpack.config.js ./
RUN npm i --silent
COPY Web/frontend ./frontend
RUN npm start

# Build the main packages.
FROM microsoft/dotnet:2.2-sdk
LABEL maintainer="dennis@dhedegaard.dk"
ARG DEBIAN_FRONTEND=noninteractive
EXPOSE 5123
ENV ASPNETCORE_URLS=http://127.0.0.1:5123
ENV FETCHER_HUB_CONNECTION_URL=http://127.0.0.1:5123/data

WORKDIR /source

# Restore .dotnet core packages.
WORKDIR /source/Core
COPY Core/*.csproj .
WORKDIR /source/Web
COPY Web/*.csproj .
RUN dotnet restore
WORKDIR /source/Fetcher
COPY Fetcher/*.csproj .
RUN dotnet restore
WORKDIR /source

# Copy everything in.
WORKDIR /source
COPY . .

# Build the fetcher.
WORKDIR /source/Fetcher
RUN dotnet publish --output /app --configuration Release

# Build the web.
WORKDIR /source/Web
COPY --from=frontend /source/wwwroot/* /source/Web/wwwroot/
RUN dotnet publish --output /app --configuration Release

# Run the published application.
WORKDIR /app
CMD ["dotnet", "Web.dll", "-c", "Release"]
