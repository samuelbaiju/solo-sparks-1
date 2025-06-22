# Solo Sparks: A Self-Discovery & Personal Growth Quest System

![Solo Sparks Dashboard](https://res.cloudinary.com/djzbdq8p4/image/upload/v1718991307/solo_sparks_screenshot_-_dashboard.png)

## 1. Objective

Solo Sparks is a web application designed to promote self-awareness, emotional intelligence, and personal growth. It provides users with personalized "quests"—small, reflective activities like watching a sunset or trying a new hobby alone. By completing quests, users earn "Spark Points," which they can redeem for rewards, gamifying the journey of self-discovery.

The core mission is to help people build a stronger relationship with themselves through mindful activities and reflections.

---

## 2. Core Features

*   **Personalized Quests:** An intelligent engine suggests daily, weekly, and monthly quests based on the user's profile and past activities.
*   **Multimedia Reflections:** Users can submit reflections via text, photo, or audio, creating a rich personal journal.
*   **Gamified Points System:** Completing quests earns "Spark Points" and levels up the user's "Spark Level," providing a tangible sense of progress.
*   **Rewards Store:** Users can redeem their Spark Points for fun and engaging rewards.
*   **Engaging Dashboard:** Features a "Tip of the Day" and a "Spark Points Meter" to keep users motivated.
*   **Shareable Reflections:** Users can share their reflections publicly via a unique link.

---

## 3. Tech Stack

This project is a full-stack application built with a modern technology set.

| Area           | Technology                                                                                                    |
| :------------- | :------------------------------------------------------------------------------------------------------------ |
| **Frontend**   | **React.js**, **Tailwind CSS**, [React Router](https://reactrouter.com/), [Axios](https://axios-http.com/)      |
| **Backend**    | **Django**, **Django REST Framework**, [PostgreSQL](https://www.postgresql.org/)                                |
| **Database**   | PostgreSQL                                                                                                    |
| **File Storage** | [Cloudinary](https://cloudinary.com/) for cloud-based image and audio hosting.                                |
| **Authentication**| JWT (JSON Web Tokens)                                                                                       |

---

## 4. Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

Make sure you have the following installed:

*   [Node.js](https://nodejs.org/) (which includes npm)
*   [Python](https://www.python.org/)
*   `pip` (Python package installer)
*   [PostgreSQL](https://www.postgresql.org/download/)

### Setup Instructions

#### **Step 1: Clone the Repository**

```bash
git clone https://github.com/your-username/solo-sparks.git
cd solo-sparks
```

#### **Step 2: Backend Setup**

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create and activate a Python virtual environment:**
    *   On macOS/Linux:
        ```bash
        python3 -m venv venv
        source venv/bin/activate
        ```
    *   On Windows:
        ```bash
        python -m venv venv
        .\venv\Scripts\activate
        ```

3.  **Install the required dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Set up the PostgreSQL Database:**
    *   Create a new PostgreSQL database.
    *   Open `backend/solo_sparks/settings.py` and update the `DATABASES` configuration with your credentials:
        ```python
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.postgresql',
                'NAME': 'your_db_name',
                'USER': 'your_db_user',
                'PASSWORD': 'your_db_password',
                'HOST': 'localhost',
                'PORT': '5432',
            }
        }
        ```

5.  **Configure Cloudinary for File Storage:**
    *   Sign up for a free [Cloudinary](https://cloudinary.com/) account.
    *   In the `backend/solo_sparks/settings.py` file, add your Cloudinary details. You can find this in your Cloudinary dashboard.
        ```python
        CLOUDINARY_STORAGE = {
            'CLOUD_NAME': 'your_cloud_name',
            'API_KEY': 'your_api_key',
            'API_SECRET': 'your_api_secret',
        }
        ```

6.  **Run Database Migrations:**
    ```bash
    python manage.py migrate
    ```

7.  **Start the Backend Server:**
    ```bash
    python manage.py runserver
    ```
    The backend will be running at `http://127.0.0.1:8000`.

#### **Step 3: Frontend Setup**

1.  **Navigate to the frontend directory** (from the root folder):
    ```bash
    cd frontend
    ```

2.  **Install the necessary npm packages:**
    ```bash
    npm install
    ```

3.  **Start the Frontend Development Server:**
    ```bash
    npm start
    ```
    The frontend application will open automatically in your browser at `http://localhost:3000`.

---

## 5. Key Application URLs

Once logged in, you can navigate to the following key sections of the application:

*   `/dashboard`: The main hub where users see their quests and progress.
*   `/rewards`: The store where Spark Points can be redeemed.
*   `/my-reflections`: A gallery of the user's past reflections.
*   `/reflection/:questId`: The page where a user completes a quest and submits their reflection.

---

## 6. API Endpoints

The frontend communicates with the Django backend via the following API endpoints:

| Method | Endpoint                        | Description                                     |
| :----- | :------------------------------ | :---------------------------------------------- |
| POST   | `/api/register/`                | Create a new user account.                      |
| POST   | `/api/token/`                   | Obtain JWT for a user (Login).                  |
| GET    | `/api/quests/`                  | Get a list of recommended quests for the user.  |
| POST   | `/api/reflections/`             | Submit a new reflection for a completed quest.  |
| GET    | `/api/my-reflections/`          | Get all reflections for the logged-in user.     |
| GET    | `/api/public-reflection/:id/`   | Get a single, publicly shared reflection.       |
| GET    | `/api/rewards/`                 | Get a list of all available rewards.            |
| POST   | `/api/rewards/:id/redeem/`      | Redeem a reward using Spark Points.             |
| GET    | `/api/profile/`                 | Get the logged-in user's profile and points.    |

Enjoy your journey with Solo Sparks! 