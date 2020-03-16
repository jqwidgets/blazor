# Blazor CLI + Processor

## Prerequisite

### .NET Core SDK 

```bash
https://dotnet.microsoft.com/download/dotnet-core
```

## Run Project

```bash
dotnet watch run
```


## Run Processor

```bash
cd processor
node processor-blazor.js
```


## Create Blazor Project From Scratch

### Install .NET Core SDK 

```bash
https://dotnet.microsoft.com/download/dotnet-core
```

### Install Blazor Default Templates

```bash
dotnet new --install Microsoft.AspNetCore.Blazor.Templates::3.2.0-preview1.20073.1
```

### Create Project

```bash
dotnet new blazorwasm -o blazor-web
```

### Run Project

```bash
dotnet watch run
```
