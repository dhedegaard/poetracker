FROM microsoft/dotnet:2.1-sdk
ARG DEBIAN_FRONTEND=noninteractive
EXPOSE 5123
ENV ASPNETCORE_URLS=http://127.0.0.1:5123
ENV FETCHER_HUB_CONNECTION_URL=http://127.0.0.1:5123/data

WORKDIR /source

# Update everything in the image.
RUN apt-get update -qq && \
    apt-get dist-upgrade -qqy

# Add NodeJs.
RUN curl -sL -q https://deb.nodesource.com/setup_8.x | bash - && \
    apt-get install -qqy nodejs && \
    npm i -g yarn

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

# Install all nodejs dependencies globally.
WORKDIR /
COPY Web/package.json .
RUN yarn install --non-interactive

# Copy everything in.
WORKDIR /source
COPY . .

# Build the fetcher.
WORKDIR /source/Fetcher
RUN dotnet publish --output /app --configuration Release

# Build the frontend.
WORKDIR /source/Web
RUN /node_modules/.bin/webpack -p
RUN dotnet publish --output /app --configuration Release

# Run the published application.
WORKDIR /app
CMD ["dotnet", "Web.dll"]
