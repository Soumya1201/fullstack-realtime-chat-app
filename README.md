# Fullstack Realtime Chat App

A realtime chat application built with React for the frontend and Node.js for the backend, featuring user authentication, messaging, and real-time communication using Socket.io.

## Features

- User registration and login
- Real-time messaging
- Chat rooms and private chats
- Responsive design
- Cloudinary integration for media uploads

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB
- **Real-time:** Socket.io
- **Authentication:** JWT
- **Deployment:** Render

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd NodeChat
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

4. Set up environment variables:
   - Create a `.env` file in the backend directory with necessary variables (e.g., MongoDB URI, JWT secret, Cloudinary config)

5. Start the backend:
   ```bash
   cd backend
   npm start
   ```

6. Start the frontend:
   ```bash
   cd ../frontend
   npm run dev
   ```

7. Open your browser and navigate to `http://localhost:5173`

## Deployment

The application is deployed on Render at: https://fullstack-realtime-chat-app-sv83.onrender.com

## Contributing

Feel free to submit issues and pull requests.

## License

This project is licensed under the MIT License.
