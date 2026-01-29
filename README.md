# Simple Web App - ASP.NET Core

Project đơn giản chạy trên IIS Server

## Yêu cầu
- .NET 6.0 SDK
- IIS với ASP.NET Core Hosting Bundle
- Windows Server hoặc Windows 10/11 với IIS enabled

## Build Project

```bash
dotnet restore
dotnet build
dotnet publish -c Release -o ./publish
```

## Cài đặt trên IIS

### 1. Cài đặt ASP.NET Core Hosting Bundle
- Download từ: https://dotnet.microsoft.com/download/dotnet/6.0
- Cài đặt "ASP.NET Core Runtime - Windows Hosting Bundle"
- Restart IIS: `iisreset`

### 2. Tạo Application Pool
- Mở IIS Manager
- Tạo Application Pool mới: `SimpleWebAppPool`
- Set .NET CLR version: `No Managed Code`
- Pipeline Mode: `Integrated`

### 3. Deploy ứng dụng
- Copy folder `publish` vào thư mục trên server (ví dụ: `C:\inetpub\SimpleWebApp`)
- Tạo Website hoặc Application trong IIS
- Chọn Application Pool: `SimpleWebAppPool`
- Set Physical path đến thư mục publish

### 4. Kiểm tra permissions
- Đảm bảo IIS AppPool user có quyền Read & Execute trên thư mục

## Test Local

```bash
dotnet run
```

Truy cập:
- http://localhost:5000/api/home
- http://localhost:5000/api/home/info
- http://localhost:5000/swagger (nếu Development mode)

## API Endpoints

- `GET /api/home` - Thông báo chào mừng
- `GET /api/home/info` - Thông tin ứng dụng
