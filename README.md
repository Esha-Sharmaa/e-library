# E_Library Project

## Table of Contents

- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Middleware](#middleware)
- [Validators](#validators)
- [Controllers](#controllers)
- [Routes](#routes)

## Project Structure

```
/project-root
|-- /controllers
|   |-- user.controller.js
|   |-- pages.controller.js
|
|-- /middlewares
|   |-- auth.middleware.js
|   |-- multer.middleware.js
|
|-- /models
|   |-- user.model.js
|   |-- blog.model.js
|
|-- /utils
|   |-- asyncHandler.js
|   |-- ApiError.js
|   |-- cloudinary.js
|
|-- /validators
|   |-- validateRegisterUser.js
|   |-- validateUpdateUser.js
|   |-- validateDeleteUser.js
|
|-- /routes
|   |-- user.routes.js
|   |-- pages.routes.js
|
|-- app.js
|-- package.json
|-- README.md
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/DevrajPun/E_library.git
   ```
2. Navigate to the project directory:
   ```bash
   cd user-management-backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the project root and add your environment variables:
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET_KEY=your_jwt_secret
   REFRESH_TOKEN_SECRET_KEY=your_refresh_token_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

## Usage

1. Start the server:
   ```bash
   npm run dev
   ```
2. Access the API at `http://localhost:8080`.

## Middleware

### auth.middleware.js

- `verifyJWT`: Middleware to verify JSON Web Token (JWT) for protected routes.
- `isAdmin`: Middleware to check if the authenticated user has admin privileges.

### multer.middleware.js

- `upload`: Middleware to handle file uploads using Multer. Configured to upload single files.

## Validators

### validateRegisterUser.js

- Validates the user registration data including enrollment number, full name, password, email, and phone number.

### validateUpdateUser.js

- Validates the user update data including full name, email, phone number, course, gender, and date of birth.

### validateDeleteUser.js

- Validates the user deletion request to ensure a valid user ID is provided.

## Controllers

### user.controller.js

- `registerUser`: Handles user registration.
- `loginUser`: Handles user login.
- `updateUserAvatar`: Updates the user's avatar.
- `changeUserPassword`: Changes the user's password.
- `refreshAccessToken`: Refreshes the user's access token.
- `getUserInfo`: Retrieves user information.
- `updateUserDetails`: Updates the user's details.
- `renderAdminDashboard`: Renders the admin dashboard.
- `logoutUser`: Logs out the user.
- `deleteUser`: Deletes a user.

### pages.controller.js

- `handleUserHomePage`: Renders the user home page.
- `handleLoginRender`: Renders the login page.
- `handleAdminDashboardRender`: Renders the admin dashboard.
- `handleAdminProfileRender`: Renders the admin profile page.
- `handleAdminListRender`: Renders the list of admin users.
- `handleStudentListRender`: Renders the list of student users.
- `handleUploadBlogRender`: Renders the blog upload page.
- `fetchAllBlogs`: Fetches and renders all blogs.

## Routes

### user.routes.js

- `POST /login`: Logs in a user.
- `GET /logout`: Logs out a user.
- `POST /refresh-token`: Refreshes the access token.
- `POST /change-password`: Changes the user's password. Protected route.
- `POST /update-details`: Updates user details. Protected route.
- `GET /user-info`: Retrieves user information. Protected route.
- `POST /register`: Registers a new user. Protected and admin-only route.
- `POST /update-avatar`: Updates the user's avatar. Protected route.
- `GET /delete-user`: Deletes a user. Protected and admin-only route.

### pages.routes.js

- `GET /`: Renders the user home page.
- `GET /login`: Renders the login page.
- `GET /admin-dashboard`: Renders the admin dashboard. Protected and admin-only route.
- `GET /admin-profile`: Renders the admin profile page. Protected and admin-only route.
- `GET /admin-list`: Renders the list of admin users. Protected and admin-only route.
- `GET /student-list`: Renders the list of student users. Protected and admin-only route.
- `GET /upload-blog`: Renders the blog upload page. Protected route.
- `GET /blog-list`: Fetches and renders all blogs. Protected route.
