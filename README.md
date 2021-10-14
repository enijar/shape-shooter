# Shape Shooter

Battle-Royale, but you're all shapes...

[Play Online!](https://shapeshooter.io)

### Getting Started

```shell
cp client/env.example.ts client/env.ts
cp server/env.example.ts server/env.ts
npm install
npm start
# Client runs on http://localhost:8080
# Server runs on http://localhost:3000
```

### Self-Hosting

If you want to self-host this game, follow the following installation instructions.

**Hardware Requirements**

- Min. 4GB RAM
- Min. 4vCPU
- Min. 300MB available storage

**Software Requirements**

- Ubuntu 20.04 (or a similar Debian Linux distro)
- NGINX 1.17
- Node.JS 15
- NPM 7
- PM2 4.5

**Server Installation**

```shell
# Clone the latest stable code into /var/www/shape-shooter
git clone https://github.com/Enijar/shape-shooter /var/www/shape-shooter

# Enter the git directory
cd /var/www/shape-shooter

# Create env files
cp client/env.example.ts client/env.ts
cp server/env.example.ts server/env.ts
# Modify the newly created env files to change default game settings 👆

# Install + build
npm install
npm run build

# Install PM2 globally (if not already installed)
npm add -g pm2

# Run the game server with PM2
pm2 start --name "game" /var/www/shape-shooter/server/build/index.js
```

**NGINX Config**

```text
server {
    listen [::]:443 ssl ipv6only=on;
    listen 443 ssl;
    server_name shapeshooter.io;

    location /api {
        proxy_http_version 1.1;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_pass http://localhost:3000; # 👈 this should match server env
    }

    location / {
        index index.html;
        absolute_redirect off;
        root /var/www/shape-shooter/client/build;
        try_files $uri $uri/ /index.html =404;
    }

    # SSL settings...
}
```
