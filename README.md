# ✈️ Wanderlust | find your next adventure

### A Full-Stack Peer-to-Peer Travel & Accommodation Platform

![Project Banner](screenshots/banner.png)

---

## 📖 About the Project

**Wanderlust** is a feature-rich web application inspired by Airbnb, designed to connect travelers with unique accommodation options. Built using the **MVC (Model-View-Controller)** architecture, it offers a seamless experience for users to browse listings, view locations on interactive maps, and manage bookings.

The platform distinguishes between **Host** and **Guest** roles, allowing users to monetize their properties while offering travelers a secure way to discover and book stays. It features server-side validation, secure authentication, and cloud-based image storage.

---

## ✨ Key Features

### 🏨 Core Listing Management
* **CRUD Operations:** Users can Create, Read, Update, and Delete property listings.
* **Image Uploads:** Integrated with **Cloudinary** and **Multer** for seamless cloud storage of listing photos.
* **Geocoding & Maps:** Powered by **Mapbox API**. When a user creates a listing, the location is automatically converted to coordinates (Geocoding) and displayed on an interactive map.

### 🔍 Search & Discovery
* **Advanced Search:** Users can search destinations by city, country, or keywords.
* **Category Filters:** Dynamic filtering for categories like "Trending," "Castles," "Arctic," and "Amazing Pools."

### 📅 Booking System (Host & Guest Workflows)
* **Booking Requests:** Guests can select check-in/check-out dates and send booking requests.
* **"My Trips" Dashboard:** Guests can track the status of their upcoming trips (Pending/Confirmed).
* **Host Dashboard:** Property owners receive real-time requests and can **Accept** or **Reject** bookings directly from their management panel.

### 💬 Review & Rating System
* **Interactive Reviews:** Users can leave star ratings and written reviews for listings.
* **Starability:** Visual star rating interface for better UX.
* **Authorization:** Users can only delete reviews they have authored.

### 🛡️ Security & Architecture
* **MVC Pattern:** Clean separation of concerns (Models, Views, Controllers) for maintainable code.
* **Authentication:** Secure login and signup using **Passport.js** (PBKDF2 hashing).
* **Authorization Middleware:** Protects sensitive routes (e.g., only the listing owner can edit their listing).
* **Data Validation:** Robust server-side validation using **Joi** schema validation to prevent bad data entry.
* **Flash Messages:** Instant feedback for success/error actions.

---

## 🛠️ Tech Stack

### Frontend
* **HTML5, CSS3, JavaScript (ES6)**
* **Bootstrap 5** (Responsive Grid & Components)
* **EJS** (Embedded JavaScript Templating)

### Backend
* **Node.js** (Runtime Environment)
* **Express.js** (Web Framework)
* **RESTful APIs**

### Database & Storage
* **MongoDB Atlas** (Cloud Database)
* **Mongoose** (ODM for MongoDB)
* **Cloudinary** (Image Storage Service)

### External APIs & Tools
* **Mapbox GL JS** (Interactive Maps)
* **Mapbox Geocoding SDK** (Address to Coordinates)
* **Passport.js** (Authentication)
* **Joi** (Schema Validation)

---

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites
* Node.js installed
* MongoDB Atlas Account
* Cloudinary Account
* Mapbox Account

### Installation

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/Wanderlust.git](https://github.com/YOUR_USERNAME/Wanderlust.git)
    cd Wanderlust
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory. Add the following keys (replace values with your own credentials):

    ```env
    CLOUD_NAME=your_cloudinary_cloud_name
    CLOUD_API_KEY=your_cloudinary_api_key
    CLOUD_API_SECRET=your_cloudinary_api_secret
    MAP_TOKEN=your_mapbox_public_token
    ATLASDB_URL=your_mongodb_connection_string
    SECRET=your_session_secret_key
    ```

4.  **Start the Server**
    ```bash
    node app.js
    ```

5.  **Access the Application**
    Open your browser and navigate to:
    `http://localhost:8080`

---

## 📸 Screen Previews

### 1. Home Page with Category Filters
![Home Page](screenshots/home.png)

### 2. Interactive Map & Details
![Listing Details](screenshots/details.png)

### 3. Host Dashboard (Manage Bookings)
![Host Dashboard](screenshots/dashboard.png)


---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/YOUR_USERNAME/Wanderlust/issues).

## 👤 Author
**[Anurag Verma]**
* **GitHub:** [github.com/anuragverma025](https://github.com/anuragverma025)
* **LinkedIn:** [linkedin.com/in/AnuragVerma](https://linkedin.com/in/AnuragVerma)
* **Email:** anuragverma9613@gmail.com

---
*Made with ❤️ by [Anurag Verma]*