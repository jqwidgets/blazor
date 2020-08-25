# Blazor Dev Server + Processors

### This repo contains the source files for jQWidgets Blazor framework - "jQWidgets.Blazor"

## Prerequisite

### Node.js

```bash
https://nodejs.org/en/
```

### .NET Core SDK 

```bash
https://dotnet.microsoft.com/download/dotnet-core
```

## Run Dev Server

```bash
cd dev-project
```

```bash
dotnet watch run
```
## Library And API Processor

### Builds the "jQWidgets.Blazor" library files and generates the API files

```bash
cd processors
node library-and-api
```

## Site Demos Processor

### Builds the demos hosted on www.jqwidgets.com

```bash
cd processors
node site-demos
```

## Getting Started Demos Processor

### Builds the demos needed for the getting started documentation.

```bash
cd processors
node getting-started-demos
```

## Nuget Library Update

```bash
cd library/jQWidgets.Blazor
Open `jQWidgets.Blazor.csproj` and update `Version` tag
dotnet pack
```

#### The build file is located in 

```bash
library/jQWidgets.Blazor/bin/Debug/jQWidgets.Blazor.[VERSION].nupkg
```


#### Either update it manually via nuget official site or via CLI

```bash
dotnet nuget push [buildFilePath] -k [APIKey] -s https://api.nuget.org/v3/index.json
```
