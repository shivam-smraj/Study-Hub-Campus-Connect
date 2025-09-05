# IIESTian Study Hub

[![Website](https://img.shields.io/badge/Website-Online-brightgreen)](https://iiestian-study.vercel.app/)

A centralized and personalized platform for first-year students at IIEST Shibpur to access study materials, notes, and previous year question papers. Built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Table of Contents

*   [Features](#features)
*   [Demo](#demo)
*   [Technologies Used](#technologies-used)
*   [Prerequisites](#prerequisites)
*   [Installation](#installation)
*   [Environment Variables](#environment-variables)
*   [Running the Application](#running-the-application)
*   [Data Seeding](#data-seeding)
*   [Contributing](#contributing)
*   [License](#license)
*   [Contact](#contact)

## Features

*   **Comprehensive Study Materials:** Access a wide range of notes, lab manuals, and question papers for all first-year subjects.
*   **Branch-Specific Organization:** Materials are neatly organized by engineering branch for easy navigation.
*   **Google Docs Viewer:** Preview PDF, PPTX, and DOCX files directly in your browser without downloading.
*   **Server-Side Bookmarking:** Save important files to your personalized list and access them from any device.
*   **User Collections:** Create custom lists of study materials to organize your learning.
*   **Global Search:** Quickly find any file by name.
*   **Mobile-First Responsive Design:** The site works seamlessly on any device.

## Demo

[Live Link](https://iiestian-study.vercel.app/)

## Technologies Used

*   **Frontend:**
    *   React.js
    *   React Router
    *   Axios
    *   react-intersection-observer
*   **Backend:**
    *   Node.js
    *   Express.js
    *   Mongoose
    *   Passport.js
    *   passport-google-oauth20
    *   express-session
    *   connect-mongo
    *   cookie-parser
*   **Database:**
    *   MongoDB (hosted on MongoDB Atlas)
*   **Cloud Storage:**
    *   Google Drive (for initial file hosting)
*   **Deployment:**
    *   Vercel

## Prerequisites

Before you begin, ensure you have met the following requirements:

*   [Node.js](https://nodejs.org/) (LTS version recommended)
*   [npm](https://www.npmjs.com/) (Node Package Manager)
*   [Git](https://git-scm.com/)
*   A Google Cloud Platform project with the Google Drive API enabled and OAuth 2.0 Client ID configured.
*   A MongoDB Atlas account.

## Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/[your-github-username]/[your-repository-name].git
    cd [your-repository-name]
    ```

2.  **Install server dependencies:**

    ```bash
    cd server
    npm install
    ```

3.  **Install client dependencies:**

    ```bash
    cd client
    npm install
    ```

## Environment Variables

To run this application, you will need to configure the following environment variables. Create a `.env` file in both the `server` and `client` directories.

**Server (`server/.env`):**
