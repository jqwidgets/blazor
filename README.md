# Blazor Dev Server + Processors

### This repo contains the source files for jQWidgets Blazor framework - "jQWidgets.Blazor"

## Prerequisite

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
