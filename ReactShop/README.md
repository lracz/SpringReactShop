# ReactShop & Forum

A fully functional webshop with user/admin authentication, product management, cart functionality, and a WebSocket-powered forum chat.

## Run Locally

**Prerequisites:** * Node.js installed
* MongoDB installed and running locally

**1. Backend Setup**
Navigate to the server folder and install dependencies:
```bash
cd server
npm install
node seed.js  # Optional: Seeds the database with initial products and users
node server.js