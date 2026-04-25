# BHULink MERN-Stack Web Application.


## Project Overview

_A real-time **Chat application** built using the MERN stack (MongoDB, Express, React, Node.js) and styled with Tailwind CSS. It supports user authentication, group chats, and instant messaging with sound and visual notifications._

## Technologies & Packages Used

-   **MongoDB**: NoSQL database for flexible and scalable data storage.
-   **Express.js**: Web application framework for Node.js, providing robust features for web and mobile applications.
-   **Node.js**: JavaScript runtime for server-side development.
-   **React.js**: A JavaScript library for building reusable UI components and efficient single-page application views.
-   **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
-   **Socket.IO**: Enables real-time, bidirectional and event-based communication.
-   **JWT (JSON Web Tokens)**: Securely transmits information between parties as a JSON object.
-   **Redux**: A Predictable State Container for JavaScript Apps.
-   **React-Toastify**: A JavaScript library for providing toast notifications in React.

## Key Features

-   **User Authentication:** SignIn, SignUp, and Logout functionality.
-   **Real-time Chat:** Users can send and receive messages in real-time.
-   **Group Chat:** Create and participate in group chats.
-   **Message Notifications:** Get notified of new messages with sound and visual alerts.
-   **State Management:** Manage application state efficiently using Redux.
-   **Responsive Design:** Tailwind CSS for a responsive and modern user interface.
<!-- -   **User Status:** Display online/offline status of users. -->

## How to Install

Follow these steps to set up and run the project locally:

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/akashdeep023/Chat_App.git
    cd Chat_App
    ```

2.  **Install Dependencies:**
    Frontend Folder :

    ```bash
    cd frontend
    npm install
    ```

    Backend Folder :

    ```bash
    cd backend
    npm install
    ```

3.  **Set Up Environment Variables:**

    Configure the following environment variables by creating a .env file in the root of Forntend and Backend Folder:

    Frontend Folder :

    ```bash
    VITE_BACKEND_URL=http://localhost:9000
    ```

    Backend Folder :

    ```bash
    FRONTEND_URL=http://localhost:5173
    MONGODB_URI=mongodb://127.0.0.1:27017/chat-app
    PORT=9000
    JWT_SECRET=secret-kvndkvdlkajkhkJkBiu6JJNjkbhkvnskcmhLJ5dKbkjsamnv
    ```

    Replace the values with your specific configurations.

4.  **Run the Application:**

    Frontend Folder :

    ```bash
    npm run dev
    ```

    Backend Folder :

    ```bash
    npm run dev
    ```

5.  **Open in Your Browser:**

Open `http://localhost:5173` in your web browser.

## Project Structure

    ├── frontend
    │   ├── public
    │   ├── src
    │   │   ├── assets
    │   │   ├── components
    │   │   ├── pages
    │   │   ├── redux
    │   │   ├── socket
    │   │   ├── utils
    │   │   ├── App.jsx
    │   │   ├── main.jsx
    │   │   └── index.css
    │   ├── index.html
    │   ├── tailwind.config.js
    │   ├── .env
    │   └── package.json
    ├── backend
    │   ├── config
    │   ├── controllers
    │   ├── middlewares
    │   ├── models
    │   ├── routes
    │   ├── server.js
    │   ├── .env
    │   └── package.json
    └── README.md
