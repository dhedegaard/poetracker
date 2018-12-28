FROM microsoft/dotnet:2.2-sdk
LABEL maintainer="dennis@dhedegaard.dk"
ARG DEBIAN_FRONTEND=noninteractive
EXPOSE 5123
ENV ASPNETCORE_URLS=http://127.0.0.1:5123
ENV FETCHER_HUB_CONNECTION_URL=http://127.0.0.1:5123/data

WORKDIR /source

# Update everything in the image and install NodeJS.
RUN apt-get update -qq && \
    apt-get dist-upgrade -qqy && \
    curl -sL -q https://deb.nodesource.com/setup_10.x | bash - && \
    apt-get install --no-install-recommends -qqy nodejs && \
    apt clean && \
    rm -rf /var/lib/apt/lists/*

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
WORKDIR /source/Web
COPY Web/package.json .
RUN npm install --silent

# Copy everything in.
WORKDIR /source
COPY . .

# Build the fetcher.
WORKDIR /source/Fetcher
RUN dotnet publish --output /app --configuration Release

# Build the frontend.
WORKDIR /source/Web
RUN npm start
RUN dotnet publish --output /app --configuration Release

# Run the published application.
WORKDIR /app
CMD ["dotnet", "Web.dll", "-c", "Release"]
