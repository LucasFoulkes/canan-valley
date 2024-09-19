Here’s the updated version of your **Project Setup Guide**, with the option to configure Nginx for both **port forwarding** (reverse proxy) and **direct serving without port forwarding**.

---

# Project Setup Guide

This guide walks you through setting up a new project with Vite, PWA support, Tailwind CSS, shadcn/ui, and configuring SSL using Let's Encrypt. It also covers configuring Nginx for both port forwarding (reverse proxy) and serving static content directly.

## 1. Vite Setup

1. Create a new Vite project:

   ```bash
   npm create vite@latest
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## 2. Add PWA Support

1. Install PWA dependencies:

   ```bash
   npm install vite-plugin-pwa @vite-pwa/assets-generator -D
   ```

2. Configure the PWA plugin in `vite.config.ts`:

   ```typescript
   import { defineConfig } from "vite";
   import react from "@vitejs/plugin-react";
   import { VitePWA } from "vite-plugin-pwa";

   export default defineConfig({
     plugins: [
       react(),
       VitePWA({
         registerType: "autoUpdate",
         includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
         manifest: {
           name: "Vite PWA Project",
           short_name: "Vite PWA",
           theme_color: "#ffffff",
           icons: [
             { src: "pwa-64x64.png", sizes: "64x64", type: "image/png" },
             { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
             { src: "pwa-512x512.png", sizes: "512x512", type: "image/png", purpose: "any" },
             { src: "maskable-icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
           ],
         },
       }),
     ],
   });
   ```

3. Add a script to generate PWA assets in `package.json`:

   ```json
   "scripts": {
     "generate-pwa-assets": "pwa-assets-generator --preset minimal public/logo.svg"
   }
   ```

4. Generate assets:

   ```bash
   npm run generate-pwa-assets
   ```

5. Add PWA assets in `index.html`:

   ```html
   <head>
     <link rel="icon" href="/favicon.ico" />
     <link rel="apple-touch-icon" href="/apple-touch-icon-180x180.png" sizes="180x180" />
     <link rel="mask-icon" href="/mask-icon.svg" color="#FFFFFF" />
     <meta name="theme-color" content="#ffffff" />
   </head>
   ```

## 3. Host Your Project Online

### Nginx Setup

1. Update the `dev` script in `package.json` for external access:

   ```json
   "scripts": {
     "dev": "vite --host"
   }
   ```

2. Install Nginx:

   ```bash
   sudo apt update
   sudo apt install nginx
   ```

3. Configure Nginx with port forwarding for your domain:

   ```bash
   sudo nano /etc/nginx/sites-available/domain1.com
   ```

4. Nginx configuration for **HTTP**:

   ```nginx
   server {
     listen 80;
     server_name domain1.com www.domain1.com;
     location / {
       proxy_pass http://localhost:5000;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
     }
   }
   ```

5. Nginx configuration for **HTTPS** (with port forwarding):

   ```nginx
   server {
     listen 443 ssl;
     server_name domain1.com www.domain1.com;

     ssl_certificate /etc/letsencrypt/live/domain1.com/fullchain.pem;
     ssl_certificate_key /etc/letsencrypt/live/domain1.com/privkey.pem;

     location / {
       proxy_pass http://localhost:5173;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
     }
   }

   # Redirect HTTP to HTTPS
   server {
     listen 80;
     server_name domain1.com www.domain1.com;
     return 301 https://$host$request_uri;
   }
   ```

6. Create symbolic links to enable the site:

   ```bash
   sudo ln -s /etc/nginx/sites-available/domain1.com /etc/nginx/sites-enabled/
   ```

7. Create the root directory (if serving files directly) and set permissions:

   ```bash
   sudo mkdir -p /var/www/domain1
   sudo chown -R $USER:$USER /var/www/domain1
   sudo chmod -R 755 /var/www
   ```

8. Test and restart Nginx:

   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### SSL Setup with Let's Encrypt

1. Install Certbot and Nginx plugin:

   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

2. Obtain and install SSL certificates:

   ```bash
   sudo certbot --nginx -d domain1.com -d www.domain1.com
   ```

3. Certbot will handle the SSL configuration and automatically set up the SSL certificates in your Nginx server block.

4. Test the SSL configuration and renew certificates (automatically handled by Certbot):

   ```bash
   sudo certbot renew --dry-run
   ```

5. Your site should now be accessible over HTTPS with automatic HTTP-to-HTTPS redirection.

---

## 4. Install Tailwind CSS

1. Install Tailwind CSS:

   ```bash
   npm install -D tailwindcss postcss autoprefixer
   ```

2. Generate configuration files:

   ```bash
   npx tailwindcss init -p
   ```

3. Update `tailwind.config.js`:

   ```js
   export default {
     content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
     theme: {
       extend: {},
     },
     plugins: [],
   };
   ```

4. Add Tailwind directives to `src/index.css`:

   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

## 5. Install and Configure shadcn/ui

1. Install necessary types:

   ```bash
   npm i -D @types/node
   ```

2. Update `tsconfig.json` paths:

   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/*": ["./src/*"]
       }
     }
   }
   ```

3. Initialize shadcn/ui:

   ```bash
   npx shadcn@latest init
   ```

---

Now, your project is set up with Vite, PWA support, Tailwind CSS, shadcn/ui, and secured with SSL certificates using Let's Encrypt. You can choose between **port forwarding** and **direct serving** for your Nginx configuration based on your needs.