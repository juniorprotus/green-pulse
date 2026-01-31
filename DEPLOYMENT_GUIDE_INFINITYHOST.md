# GreenPulse Deployment Guide for Infinityhost

Complete step-by-step guide to deploy your GreenPulse project successfully on Infinityhost.

## Prerequisites

- Node.js (v14 or higher)
- MySQL database access
- Infinityhost hosting account with MySQL support
- Basic command line knowledge
- Domain name (.co.ke domain from Infinityhost)

**Important Note About Infinityhost Plans:**
Before proceeding, please verify that your chosen Infinityhost hosting plan includes:
- **MySQL Database Support** - Required for your application's database
- **Node.js Support** - Required to run your backend server
- **PHP Support** (if using phpMyAdmin for database management)

**Infinityhost .co.ke Domain Information:**
- The .co.ke domain (KSh 463) is just the domain name registration
- You will also need a **hosting plan** that supports MySQL and Node.js
- Domain registration and hosting are separate services
- Make sure to choose a hosting plan that includes database support

**Checking Infinityhost Plan Compatibility:**

To ensure your chosen Infinityhost plan supports your GreenPulse application:

1. **Visit Infinityhost's Hosting Plans Page**
   - Go to https://dash.infinityfree.com/accounts
   - Look for plans that mention "MySQL" or "Database Support"

2. **Look for These Features in Hosting Plans:**
   - ✅ **MySQL Databases** - Required for your application
   - ✅ **Node.js Support** - Required for your backend server
   - ✅ **PHP Support** - Helpful for database management tools
   - ✅ **SSH Access** - Useful for advanced configuration
   - ✅ **SSL Certificate** - For secure HTTPS connections

3. **Recommended Plan Types:**
   - **Business Hosting** - Usually includes MySQL and Node.js
   - **VPS Hosting** - More control and resources
   - **Cloud Hosting** - Scalable and reliable

4. **Contact Infinityhost Support:**
   - If unsure, contact Infinityhost support before purchasing
   - Ask specifically: "Does this plan support MySQL databases and Node.js applications?"
   - Confirm they can help set up both database and Node.js server

5. **Alternative Options:**
   - If your chosen plan doesn't support Node.js, consider:
     - Upgrading to a higher-tier plan
     - Using a separate Node.js hosting service
     - Using a cloud platform like Railway or Heroku for the backend

**What to Avoid:**
- Basic shared hosting plans that only support PHP/WordPress
- Plans that don't mention database support
- Plans without Node.js or JavaScript runtime support

**Budget Considerations:**
- The .co.ke domain (KSh 463) is just the beginning
- Hosting plans typically range from KSh 500-2000+ per month
- Consider the total cost: Domain + Hosting + SSL Certificate

## Step 1: Database Setup

### 1.1 Create MySQL Database on Infinityhost (Recommended)

**What this means:** Since you don't have MySQL locally, we'll create the database directly on Infinityhost's servers where your website will run.

**How to do it:**

1. **Log in to Infinityhost Control Panel**
   - Go to https://dash.infinityfree.com/accounts
   - Enter your username and password
   - If you don't have an account yet, you'll need to sign up first

2. **Find MySQL Databases**
   - Once logged in, look for "MySQL Databases" in the control panel
   - It might be under "Web Hosting", "Databases", or "Advanced Features"
   - The exact location depends on your Infinityhost plan

3. **Create a New Database**
   - Click on "Create Database" or "Add Database"
   - You'll see a form with fields to fill in
   - **Database Name:** Enter `greenpulse`
   - **Database Description:** You can enter "GreenPulse Waste Management Database"
   - Click "Create" or "Submit"

4. **Create a Database User**
   - Look for "Create User", "Add User", or "Database Users"
   - Click on it to create a new database user
   - **Username:** Enter `greenpulse_user`
   - **Password:** Create a strong password (at least 12 characters with letters, numbers, and symbols)
   - **Confirm Password:** Re-enter the same password
   - Click "Create User" or "Submit"

5. **Link User to Database (Assign Permissions)**
   - Look for "Assign User to Database", "Link User", or "Database Permissions"
   - Select your database: `greenpulse`
   - Select your user: `greenpulse_user`
   - Choose permissions: Select "ALL PRIVILEGES" or "Full Access"
   - Click "Assign" or "Save"

6. **Note Your Database Details**
   - Write down these important details:
   ```
   Database Name: greenpulse
   Username: greenpulse_user
   Password: [your_password_here]
   Host: localhost (or the host provided by Infinityhost)
   ```
   - You'll need these for the environment configuration

7. **Verify Database Creation**
   - Go back to the MySQL Databases section
   - You should see your database `greenpulse` listed
   - You should see your user `greenpulse_user` listed
   - Both should show as "Active" or "Connected"

**Important Notes:**
- **Keep your database password safe** - You'll need it for configuration
- **Infinityhost might provide a different host name** - Check what they show in the control panel
- **Some Infinityhost plans have limits** - Make sure your plan supports MySQL databases
- **Database creation might take a few minutes** - Wait for confirmation before proceeding

### 1.2 Test Database Connection (Optional)

**What this means:** If Infinityhost provides a database management tool (like phpMyAdmin), you can test the connection.

**How to do it (if available):**

1. **Find Database Management Tool**
   - Look for "phpMyAdmin", "Database Manager", or similar in Infinityhost
   - This might be in a separate section or linked from your database page

2. **Connect to Your Database**
   - Enter your database username: `greenpulse_user`
   - Enter your database password: [your_password]
   - Select your database: `greenpulse`

3. **Verify Connection**
   - If successful, you'll see your database tables (initially empty)
   - You can create a test table to verify everything works
   - If it fails, double-check your username and password

**Note:** If Infinityhost doesn't provide a database management tool, don't worry! You can test the connection later when your application is deployed.

## Step 2: Server Configuration

### 2.1 Set Up Environment Variables

**What this means:** Environment variables are like settings that tell your application how to behave. We need to create a file with your database and email settings.

**How to do it:**

1. **Open File Explorer/ Finder**
   - Navigate to your GreenPulse project folder
   - Go into the `server` folder

2. **Create the .env file**
   - You should see a file called `.env.example`
   - Make a copy of this file and rename it to `.env`
   - On Windows: Right-click → Copy, then Right-click → Paste, then rename
   - On Mac: Right-click → Duplicate, then rename

3. **Edit the .env file**
   - Right-click the `.env` file and open with Notepad (Windows) or TextEdit (Mac)
   - Replace the example values with your actual database information:

```bash
# Server Configuration
PORT=5000

# Database Configuration (MySQL)
DB_HOST=localhost
DB_USER=your_database_username_here
DB_PASSWORD=your_database_password_here
DB_NAME=greenpulse

# Authentication
JWT_SECRET=make_this_a_very_long_secret_password_at_least_32_characters

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password_here

# Production Environment
NODE_ENV=production
```

**Important Notes:**
- **JWT_SECRET**: Make this very long and secure (at least 32 characters)
- **EMAIL_PASS**: For Gmail, you need an "App Password", not your regular password
- **DB_HOST**: Usually `localhost`, but check with Infinityhost

4. **Save the file**
   - Click File → Save
   - Close the file

### 2.2 Install Server Dependencies

**What this means:** Your server needs certain software packages to run. This command downloads and installs them.

**How to do it:**

1. **Open Command Prompt/Terminal**
   - Windows: Press `Win + R`, type `cmd`, press Enter
   - Mac: Open Terminal from Applications > Utilities

2. **Navigate to the server folder**
   ```bash
   cd path/to/your/GreenPulse/server
   ```
   - Replace `path/to/your/GreenPulse` with the actual path to your project
   - Example: `cd C:\Users\YourName\Documents\GreenPulse\server`

3. **Install dependencies**
   ```bash
   npm install
   ```
   - This will download all the required packages
   - Wait for it to finish (it might take a few minutes)
   - You should see "npm WARN" messages, but no "npm ERR" messages

### 2.3 Test Server Locally

**What this means:** Before deploying to the internet, we test if your server works on your computer.

**How to do it:**

1. **Start the server**
   In the same command prompt/terminal window, type:
   ```bash
   npm start
   ```
   - You should see a message like "Server running on port 5000"
   - Don't close this window!

2. **Test the server**
   - Open your web browser
   - Go to: `http://localhost:5000`
   - You should see: "GreenPulse API is running..."
   - If you see an error, check the command prompt for error messages

3. **Stop the server**
   - Go back to the command prompt
   - Press `Ctrl + C` to stop the server
   - You can close the command prompt now

## Step 3: Frontend Configuration

### 3.1 Update API URLs

**What this means:** The frontend (what users see in their browser) needs to know where to send requests to your backend server.

**How to do it:**

1. **Find the files to edit**
   - Open your GreenPulse project folder
   - Go to the `client` folder
   - Open `script.js` in a text editor (Notepad, VS Code, etc.)
   - Also open `admin/script.js`

2. **Look for the API URL line**
   - In both files, find line 1 which should look like:
   ```javascript
   const API_URL = process.env.NODE_ENV === 'production' 
       ? 'https://your-backend-domain.com/api' 
       : 'http://localhost:5000/api';
   ```

3. **Update for production**
   - When you deploy, you'll have a domain name like `yourdomain.com`
   - If your backend will be at `api.yourdomain.com`, change it to:
   ```javascript
   const API_URL = process.env.NODE_ENV === 'production' 
       ? 'https://api.yourdomain.com/api' 
       : 'http://localhost:5000/api';
   ```
   - Replace `yourdomain.com` with your actual domain

4. **Save the files**
   - Save both `script.js` and `admin/script.js`

### 3.2 Test Frontend Locally

**What this means:** Test if your website works on your computer before putting it online.

**How to do it:**

1. **Open Command Prompt/Terminal**
   - Windows: Press `Win + R`, type `cmd`, press Enter
   - Mac: Open Terminal from Applications > Utilities

2. **Navigate to the client folder**
   ```bash
   cd path/to/your/GreenPulse/client
   ```

3. **Start a local server**
   ```bash
   python -m http.server 8000
   ```
   - If you don't have Python, you can use any local server or just open `index.html` in your browser
   - You should see "Serving HTTP on 0.0.0.0 port 8000"

4. **Test the frontend**
   - Open your web browser
   - Go to: `http://localhost:8000`
   - You should see your GreenPulse website
   - Try clicking around to make sure it loads properly
   - Note: Some features might not work without the backend running

5. **Stop the server**
   - Go back to the command prompt
   - Press `Ctrl + C` to stop the server

## Step 4: Infinityhost Deployment

### 4.1 Upload Files to Infinityhost

**What this means:** You need to upload your project files to Infinityhost's servers so people can access them online.

**How to do it:**

1. **Log in to Infinityhost**
   - Go to https://dash.infinityfree.com/accounts
   - Enter your username and password

2. **Find File Manager**
   - Look for "File Manager" in the control panel
   - It might be under "Web Hosting" or "Advanced Features"

3. **Upload your project**
   - In File Manager, navigate to your main hosting directory (usually `public_html` or `www`)
   - Click "Upload" or "Upload Files"
   - Select your entire GreenPulse project folder from your computer
   - Wait for the upload to complete

4. **Check file structure**
   - Make sure the folder structure looks like this:
   ```
   public_html/
   ├── client/
   │   ├── index.html
   │   ├── script.js
   │   ├── styles.css
   │   └── admin/
   └── server/
       ├── index.js
       ├── package.json
       └── ...
   ```

### 4.2 Set Up MySQL Database on Infinityhost

**Note:** Skip this step if you already created your database in Step 1.1. This section is for reference only.

**What this means:** Create a database on Infinityhost's servers for your application to use.

**How to do it:**

1. **Find MySQL Databases**
   - In Infinityhost control panel, look for "MySQL Databases"
   - It might be under "Web Hosting" or "Databases"

2. **Create Database**
   - Click "Create Database" or similar
   - Enter database name: `greenpulse`
   - Click "Create"

3. **Create Database User**
   - Look for "Create User" or "Database Users"
   - Enter username: `greenpulse_user`
   - Enter a strong password (write this down!)
   - Save the user

4. **Link User to Database**
   - Find "Assign User to Database" or similar
   - Select your user (`greenpulse_user`) and database (`greenpulse`)
   - Give full permissions (usually "ALL PRIVILEGES")
   - Save the assignment

5. **Note your database details**
   - Database Name: `greenpulse`
   - Username: `greenpulse_user`
   - Password: [the password you created]
   - Host: Usually `localhost` (Infinityhost will show this)

### 4.3 Configure Environment Variables on Infinityhost

**What this means:** Tell your application about your database and other settings.

**How to do it:**

1. **Find Environment Variables**
   - In Infinityhost control panel, look for "Environment Variables"
   - It might be under "Advanced Features" or "Application Settings"

2. **Add Environment Variables**
   - Add each of these variables one by one:
   
   ```
   Variable Name: DB_HOST
   Value: localhost
   
   Variable Name: DB_USER
   Value: greenpulse_user
   
   Variable Name: DB_PASSWORD
   Value: [your_database_password]
   
   Variable Name: DB_NAME
   Value: greenpulse
   
   Variable Name: JWT_SECRET
   Value: [your_very_long_secret_key]
   
   Variable Name: EMAIL_USER
   Value: your_email@gmail.com
   
   Variable Name: EMAIL_PASS
   Value: [your_gmail_app_password]
   
   Variable Name: NODE_ENV
   Value: production
   ```

3. **Save the variables**
   - Make sure to save each variable
   - Double-check for typos

### 4.4 Set Up Node.js Application

**What this means:** Configure Infinityhost to run your backend server.

**How to do it:**

1. **Find Node.js Applications**
   - Look for "Node.js Applications" in the control panel
   - It might be under "Web Hosting" or "Advanced Features"

2. **Create New Application**
   - Click "Create Application" or similar
   - Application Name: `greenpulse-server`
   - Application Path: `/server` (or the path to your server folder)
   - Startup File: `index.js`
   - Node.js Version: `v18` (or latest available)

3. **Start the Application**
   - Click "Start" or "Deploy"
   - Wait for it to start (might take a few minutes)
   - Check the application logs if there are any errors

4. **Test the backend**
   - Your backend should now be accessible at something like:
   - `https://yourdomain.com` or `https://api.yourdomain.com`
   - Visit this URL to make sure it says "GreenPulse API is running..."

## Step 5: Domain and SSL Configuration

### 5.1 Configure Domain

**What this means:** Set up your website address (domain name) to point to your Infinityhost hosting.

**How to do it:**

1. **If you already have a domain**
   - Log in to your domain registrar (where you bought your domain)
   - Find DNS settings or Name Server settings
   - Change the nameservers to Infinityhost's nameservers
   - Infinityhost nameservers are usually:
     - `ns1.infinityhost.com`
     - `ns2.infinityhost.com`
   - This change can take 24-48 hours to take effect

2. **If you need to buy a domain**
   - In Infinityhost control panel, look for "Domains" or "Register Domain"
   - Search for your desired domain name
   - Purchase and it will be automatically configured

3. **Configure Domain in Infinityhost**
   - In Infinityhost control panel, go to "Domains"
   - Select your domain
   - Point it to your hosting directory (usually `public_html`)

4. **Set up Subdomains (Optional)**
   - If you want `api.yourdomain.com` for your backend
   - Look for "Subdomains" in the control panel
   - Create a subdomain called `api`
   - Point it to your server directory

### 5.2 Enable SSL Certificate

**What this means:** SSL makes your website secure (shows a lock icon and uses https:// instead of http://).

**How to do it:**

1. **Request SSL Certificate**
   - In Infinityhost control panel, look for "SSL/TLS" or "Security"
   - Click "Request SSL Certificate" or similar
   - Select your domain
   - Choose "Free SSL Certificate" (usually Let's Encrypt)
   - Click "Request" or "Install"

2. **Wait for Installation**
   - This might take a few minutes to a few hours
   - Infinityhost will automatically configure it

3. **Force HTTPS (Recommended)**
   - Look for "Force HTTPS" or "Redirect HTTP to HTTPS"
   - Enable this setting
   - This ensures all visitors use the secure version

4. **Test SSL**
   - Visit `https://yourdomain.com` (with https)
   - You should see a lock icon in your browser
   - No security warnings should appear

## Step 6: Final Testing

### 6.1 Test Backend API

**What this means:** Make sure your server is working and responding to requests.

**How to do it:**

1. **Test the main API endpoint**
   - Open your web browser
   - Go to your backend URL (e.g., `https://api.yourdomain.com` or `https://yourdomain.com`)
   - You should see: "GreenPulse API is running..."

2. **Test API endpoints**
   - Try visiting: `https://yourdomain.com/api/auth/me`
   - You should get a response (might be an error about missing token, that's normal)
   - This confirms your API routes are working

### 6.2 Test Frontend

**What this means:** Make sure your website loads and displays correctly.

**How to do it:**

1. **Test the main website**
   - Open your web browser
   - Go to your frontend URL (e.g., `https://yourdomain.com`)
   - You should see your GreenPulse website

2. **Test basic functionality**
   - Click around the website
   - Try opening different sections
   - Make sure pages load without errors

3. **Check for mixed content warnings**
   - Look at the browser console (F12 → Console tab)
   - There should be no "Mixed Content" warnings
   - If there are, it means some resources are loading over HTTP instead of HTTPS

### 6.3 Test Database Connection

**What this means:** Verify that your application can save and retrieve data from the database.

**How to do it:**

1. **Test User Registration**
   - Go to your website
   - Try to register a new user account
   - If successful, you should see a success message
   - If it fails, check the browser console for errors

2. **Test Report Submission**
   - Log in as a user
   - Try to submit a test report
   - You should get a success message
   - Check your email for the confirmation (if email is set up)

3. **Test Admin Dashboard**
   - Log in as an admin (if you have admin credentials)
   - Check if you can see reports and user data
   - This confirms the database is working properly

**Note:** If any of these tests fail, check:
- Environment variables are correct
- Database connection is working
- API URLs are pointing to the right place
- No typos in configuration files

## Step 7: Security and Optimization

### 7.1 Security Measures

**What this means:** Protect your application from hackers and unauthorized access.

**How to do it:**

1. **Change Default JWT Secret**
   - Make sure your JWT_SECRET is very long and unique
   - Don't use the example from the guide
   - Use a random string generator if needed

2. **Use Strong Database Passwords**
   - Make your database password at least 12 characters
   - Use a mix of letters, numbers, and symbols
   - Don't reuse passwords from other services

3. **Enable Firewall Rules (If Available)**
   - In Infinityhost control panel, look for "Firewall" or "Security"
   - Only allow connections from trusted sources
   - Block suspicious IP addresses

4. **Regularly Update Dependencies**
   - Check for updates to Node.js packages
   - Update your application when security patches are released
   - Infinityhost might offer automatic updates

### 7.2 Performance Optimization

**What this means:** Make your website load faster and handle more users.

**How to do it:**

1. **Enable Gzip Compression**
   - In Infinityhost control panel, look for "Compression" or "Performance"
   - Enable gzip compression for faster page loading
   - This reduces file sizes sent to browsers

2. **Configure Caching Headers**
   - Look for "Caching" or "Cache Settings" in Infinityhost
   - Enable browser caching for static files (CSS, JS, images)
   - This makes repeat visits faster

3. **Optimize MySQL Queries**
   - Use indexes on frequently searched database columns
   - Avoid complex queries that take too long
   - Monitor slow queries in your database logs

4. **Consider Using a CDN (Content Delivery Network)**
   - A CDN stores your files on servers around the world
   - Users get files from the nearest server, making them load faster
   - Infinityhost might offer CDN services or you can use services like Cloudflare

## Troubleshooting

### Common Issues:

**Database Connection Error:**
- **Problem:** "Can't connect to database"
- **Solution:** 
  - Check your database credentials in environment variables
  - Make sure the database user has proper permissions
  - Verify the database server is running

**Application Won't Start:**
- **Problem:** Server crashes or won't start
- **Solution:**
  - Check Node.js version compatibility (use v16 or v18)
  - Verify all dependencies are installed (`npm install`)
  - Check application logs in Infinityhost control panel for error messages

**Frontend Can't Connect to Backend:**
- **Problem:** Website loads but can't communicate with server
- **Solution:**
  - Verify API URL is correct in frontend files
  - Check if you're using HTTPS for both frontend and backend
  - Ensure backend server is running and accessible

**Email Not Working:**
- **Problem:** Users don't receive email notifications
- **Solution:**
  - Verify email credentials are correct
  - For Gmail, make sure you're using an "App Password", not your regular password
  - Check if "Less secure app access" is enabled in Gmail settings

**Mixed Content Warnings:**
- **Problem:** Browser shows security warnings about HTTP content on HTTPS site
- **Solution:**
  - Make sure all API URLs use HTTPS
  - Update any hardcoded HTTP URLs to HTTPS
  - Check browser console for specific warnings

## Maintenance

### Regular Tasks:

**Monitor Application Logs:**
- Check logs weekly for errors or unusual activity
- Look for patterns that might indicate problems
- Set up alerts for critical errors

**Update Dependencies Regularly:**
- Check for security updates monthly
- Update Node.js packages when needed
- Test your application after updates

**Backup Database Regularly:**
- Set up automatic database backups
- Test that you can restore from backups
- Keep backups in a separate location

**Monitor Disk Space Usage:**
- Check available disk space monthly
- Clean up old logs and unused files
- Consider upgrading hosting plan if needed

**Check SSL Certificate Expiration:**
- SSL certificates expire after 90 days (Let's Encrypt)
- Infinityhost usually renews automatically
- Check that renewal is working properly

### Monitoring:

**Set Up Uptime Monitoring:**
- Use a service to monitor if your website is online
- Get alerts when your site goes down
- Track uptime percentage over time

**Monitor Database Performance:**
- Watch for slow queries
- Check database connection limits
- Optimize queries that take too long

**Track User Activity and Errors:**
- Monitor how many users visit your site
- Track error rates and common issues
- Use this data to improve your application

## Support

### If You Encounter Issues:

1. **Check the application logs in Infinityhost control panel**
   - Look for error messages
   - Note the time when errors occurred
   - Check for patterns

2. **Verify all environment variables are correctly set**
   - Double-check database credentials
   - Ensure JWT secret is properly configured
   - Verify email settings

3. **Test database connection independently**
   - Try connecting to your database using a database client
   - Verify the database user has proper permissions
   - Check if the database server is accessible

4. **Check network connectivity between frontend and backend**
   - Test if you can reach your backend from your frontend
   - Check for firewall or CORS issues
   - Verify DNS settings are correct

### For Additional Help:

**Infinityhost Documentation:**
- Visit Infinityhost's help center
- Look for Node.js and MySQL guides
- Check their knowledge base for common issues

**Node.js and MySQL Documentation:**
- Official Node.js documentation: nodejs.org
- MySQL documentation: dev.mysql.com
- These provide detailed technical information

**This Deployment Guide:**
- Re-read relevant sections
- Follow troubleshooting steps
- Check if you missed any configuration steps

**Getting Professional Help:**
- If you're stuck, consider hiring a developer
- Many freelancers can help with Node.js deployment
- Infinityhost support can help with hosting-related issues

### Emergency Contacts:
- **Infinityhost Support:** Available through their control panel
- **Domain Registrar:** If you have domain issues
- **Database Administrator:** If you need database help

Remember: Take your time with each step, and don't hesitate to ask for help if you get stuck!