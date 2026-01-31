# GreenPulse Split Deployment Guide (Free Tier)

This guide explains how to deploy your GreenPulse application using free services. Because InfinityFree (Free Tier) does not support Node.js, we will use a "Split Deployment" strategy:

1.  **Frontend (HTML/CSS/JS):** Deployed on **InfinityFree**.
2.  **Backend (Node.js):** Deployed on **Render** (Free Tier).
3.  **Database (MySQL):** Deployed on **Aiven** or **TiDB Cloud** (Free Tier).

---

## Part 1: Database Setup (Aiven MySQL)

Since the backend on Render needs to access the database, we cannot use InfinityFree's local database. We need a cloud database.

1.  **Sign Up for Aiven:**
    *   Go to [Aiven.io](https://aiven.io/) and sign up for a free account.
2.  **Create a Service:**
    *   Click "Create Service".
    *   Select **MySQL**.
    *   Select **Free Plan** (usually under "Hobbyist" or similar).
    *   Choose a cloud region (e.g., Google Cloud).
    *   Click "Create Service".
3.  **Get Connection Details:**
    *   Once the service is running, find the **Connection URI** (it looks like `mysql://user:password@host:port/defaultdb?ssl-mode=REQUIRED`).
    *   Copy this URI. You will need it for the backend.

---

## Part 2: Backend Deployment (Render)

1.  **Push Code to GitHub:**
    *   If you haven't already, push your `Green Pulse` project to a GitHub repository.
    *   Make sure the `server` folder is in the root or you know its path.

2.  **Sign Up for Render:**
    *   Go to [Render.com](https://render.com/) and sign up with GitHub.

3.  **Create a Web Service:**
    *   Click "New +" -> "Web Service".
    *   Connect your GitHub repository.
    *   **Name:** `greenpulse-api` (or similar).
    *   **Root Directory:** `server` (This is important! It tells Render the app is in the server folder).
    *   **Environment:** `Node`.
    *   **Build Command:** `npm install`
    *   **Start Command:** `node index.js`
    *   **Plan:** Free.

4.  **Configure Environment Variables:**
    *   Scroll down to "Environment Variables".
    *   Add the following:
        *   `DB_HOST`: (The host from Aiven, e.g., `mysql-service.aivencloud.com`)
        *   `DB_USER`: (The username from Aiven, e.g., `avnadmin`)
        *   `DB_PASSWORD`: (The password from Aiven)
        *   `DB_NAME`: `defaultdb` (or whatever database name Aiven gave you)
        *   `DB_PORT`: (The port from Aiven, usually `12345` or similar)
        *   `JWT_SECRET`: (Create a long random string)
        *   `EMAIL_USER`: (Your email for notifications)
        *   `EMAIL_PASS`: (Your email app password)
        *   `NODE_ENV`: `production`

    *   *Note:* If Aiven gives you a single connection string (URI), you might need to parse it or change your `server/config/db.js` to accept a `DATABASE_URL`. But usually, setting the individual variables works if your code supports it.

5.  **Deploy:**
    *   Click "Create Web Service".
    *   Wait for the deployment to finish.
    *   Once live, copy your **Backend URL** (e.g., `https://greenpulse-api.onrender.com`).

---

## Part 3: Frontend Configuration

Now that the backend is live, we need to tell the frontend where to find it.

1.  **Open `client/config.js`:**
    *   Locate the file `client/config.js` in your project.
    *   Update the `API_URL` with your new Render Backend URL.

    ```javascript
    const CONFIG = {
        // Replace with your actual Render URL
        API_URL: 'https://greenpulse-api.onrender.com/api' 
    };
    ```

2.  **Save the file.**

---

## Part 4: Frontend Deployment (InfinityFree)

1.  **Log in to InfinityFree:**
    *   Go to the Client Area.
    *   Open the **File Manager** for your account.

2.  **Upload Files:**
    *   Navigate to `htdocs` (or `public_html`).
    *   Delete the default `index2.html` or similar files.
    *   Upload the contents of your `client` folder.
    *   **Important:** Do NOT upload the `client` folder itself, but the *contents* inside it.
    *   Your file structure on InfinityFree should look like this:
        *   `htdocs/index.html`
        *   `htdocs/script.js`
        *   `htdocs/config.js`
        *   `htdocs/styles.css`
        *   `htdocs/admin/` (folder)

3.  **Verify:**
    *   Visit your InfinityFree domain (e.g., `greenpulse.rf.gd`).
    *   The site should load.
    *   Try to Login or Register. If it works, your Frontend is successfully talking to your Render Backend!

---

## Troubleshooting

*   **CORS Errors:** If you see "CORS error" in the browser console, you might need to update your Backend code (`server/index.js`) to allow requests from your InfinityFree domain.
    *   In `server/index.js`:
        ```javascript
        app.use(cors({
            origin: 'http://your-infinityfree-domain.com'
        }));
        ```
    *   Then redeploy the backend to Render.

*   **Database Connection Errors:** Check the Render logs. Ensure the Aiven database allows connections from anywhere (0.0.0.0/0) or specifically from Render's IPs.

*   **404 Errors:** If API calls return 404, make sure your `API_URL` in `config.js` ends with `/api` (if your backend routes start with `/api`).
