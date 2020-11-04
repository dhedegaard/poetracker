FROM mcr.microsoft.com/dotnet/sdk:5.0.100-rc.2
LABEL maintainer="dennis@dhedegaard.dk"
ARG DEBIAN_FRONTEND=noninteractive
EXPOSE 5000
ENV ASPNETCORE_URLS=http://127.0.0.1:5000
ENV FETCHER_HUB_CONNECTION_URL=http://127.0.0.1:5000/data

WORKDIR /source

# Restore .dotnet core packages.
WORKDIR /source/Core
COPY backend/Core/*.csproj .
WORKDIR /source/Web
COPY backend/Web/*.csproj .
RUN dotnet restore
WORKDIR /source/Fetcher
COPY backend/Fetcher/*.csproj .
RUN dotnet restore
WORKDIR /source

# Copy everything in.
WORKDIR /source
COPY backend/. .

# Build the fetcher.
WORKDIR /source/Fetcher
RUN dotnet publish --output /app --configuration Release

# Build the web.
WORKDIR /source/Web
RUN dotnet publish --output /app --configuration Release

# Run the published application.
WORKDIR /app
CMD ["dotnet", "Web.dll", "-c", "Release"]
