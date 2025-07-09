# MERN Stack Social Media Application

A full-stack social media application built with MongoDB, Express.js, React.js, and Node.js.

## Features

- **User Authentication**: JWT-based login/register with bcrypt password hashing
- **Posts**: Create, edit, delete, and like posts with image support
- **Comments**: Add comments to posts with real-time updates
- **Social Features**: Follow/unfollow users, user profiles with stats
- **Responsive Design**: Mobile-friendly interface with modern CSS
- **Image Upload**: Support for image uploads using Multer
- **Search**: Search for users by username or email

## Project Structure

\`\`\`
├── backend/                 # Express.js server
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── uploads/            # Uploaded images
│   └── server.js           # Server entry point
├── frontend/               # React.js client
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.js          # Main App component
│   │   └── index.js        # React entry point
│   └── public/             # Static files
└── README.md
\`\`\`

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
\`\`\`bash
cd backend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create a `.env` file in the backend directory:
\`\`\`env
MONGODB_URI=mongodb://localhost:27017/social_media
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
\`\`\`

4. Create uploads directory:
\`\`\`bash
mkdir uploads
\`\`\`

5. Start the backend server:
\`\`\`bash
npm run dev
\`\`\`

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
\`\`\`bash
cd frontend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the React development server:
\`\`\`bash
npm start
\`\`\`

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Posts
- `GET /api/posts` - Get all posts (with pagination)
- `POST /api/posts` - Create a new post (requires auth)
- `POST /api/posts/:id/like` - Like/unlike a post (requires auth)
- `POST /api/posts/:id/comments` - Add comment to post (requires auth)
- `DELETE /api/posts/:id` - Delete a post (requires auth)

### Users
- `GET /api/users/:id` - Get user profile and posts
- `POST /api/users/:id/follow` - Follow/unfollow user (requires auth)
- `PUT /api/users/profile` - Update user profile (requires auth)
- `GET /api/users/search/:query` - Search users

### Upload
- `POST /api/upload` - Upload image (requires auth)

## Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

### Frontend
- **React.js** - Frontend framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Styling with responsive design

## Features in Detail

### Authentication System
- Secure user registration and login
- JWT token-based authentication
- Password hashing with bcrypt
- Protected routes and middleware

### Post Management
- Create posts with text and images
- Like and unlike posts
- Delete own posts
- Real-time post updates

### Comment System
- Add comments to posts
- Display comments with author information
- Real-time comment updates

### User Profiles
- View user profiles with stats
- Follow/unfollow functionality
- Edit own profile (username, bio)
- User search functionality

### Responsive Design
- Mobile-first approach
- Responsive grid layouts
- Touch-friendly interface
- Modern CSS with flexbox and grid

## Development

### Running in Development Mode

Backend (with nodemon for auto-restart):
\`\`\`bash
cd backend
npm run dev
\`\`\`

Frontend (with hot reload):
\`\`\`bash
cd frontend
npm start
\`\`\`

### Building for Production

Frontend build:
\`\`\`bash
cd frontend
npm run build
\`\`\`

Backend production:
\`\`\`bash
cd backend
npm start
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
