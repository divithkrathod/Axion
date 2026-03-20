# 🚀 A Complete Beginner's Guide to Running Axion

Welcome to **Axion**! This guide is explicitly designed for anyone without a software development background. By following these steps exactly, you will have the Axion Real-Time Communication App running smoothly on your computer.

---

## 🧐 How Axion Works (A Brief Overview)

Axion is divided into three main parts:
1. **The Database (MongoDB):** This stores your users, messages, and call history.
2. **The Backend Server:** This acts as the brain. It handles login, encryption, and coordinates real-time calls.
3. **The Frontend (Browser Client):** This is the visual interface you interact with on your screen.
4. **The "Computer Vision" (CV):** Unlike many AI projects, the computer vision in Axion (facial detection, emotion recognition) **does not run on the server and does not require Python**. It uses *TensorFlow.js* to run entirely inside your browser! This means zero extra setups for AI servers. As long as you have a modern browser (like Chrome, Edge, or Firefox) and a webcam, the AI models download to your browser over the internet and run locally on your graphics card.

---

## 🛠 Step 1: Install Required Software

You only need two pieces of software installed on your computer.

### A. Install Node.js
Node.js allows your computer to run the Backend Server and package the Frontend.
1. Go to the [Node.js Download Page](https://nodejs.org/).
2. Click on the button that says **LTS (Recommended For Most Users)**.
3. Once the installer downloads, open it and click "Next" on everything. Leave all defaults as they are and finish the installation.

### B. Install MongoDB
MongoDB is the database.
1. Go to the [MongoDB Community Download Page](https://www.mongodb.com/try/download/community).
2. Look for the "MongoDB Community Server" section and click the green **Download** button.
3. Open the installer. Choose the **Complete** setup type.
4. **Very Important Checkbox:** During installation, it will ask if you want to install "MongoDB Compass". **Make sure this is checked!** Compass provides a visual interface for your database.
5. Finish the installation.

---

## 🗄 Step 2: Start Your Database (MongoDB)

1. Open your Start Menu (Windows) or Applications folder (Mac) and open **MongoDB Compass**.
2. When Compass opens, it will present a green button that says **Connect**.
3. Just click **Connect**. It will connect to `mongodb://localhost:27017` by default. 
4. *That's it! Leave this window open in the background.* Your database is now actively running.

---

## 🧠 Step 3: Start the Backend Server

This is where you activate the "brain" of the app.

1. Open the folder containing the `Axion` project code.
2. Open a terminal inside this folder:
   - **On Windows:** Open the folder in File Explorer, click the address bar at the very top, delete the path, type `cmd`, and press Enter.
   - **On Mac:** Open the Terminal app, type `cd ` (with a space), drag the `Axion` folder from Finder into the terminal, and press Enter.
3. Once your terminal is open, follow these commands *exactly*, hitting **Enter** after each line:

   ```bash
   cd server
   ```
   *You'll see your terminal location change to the `server` folder.*

   ```bash
   npm install
   ```
   *This takes a minute. It downloads all the backend files necessary for the app.*

   ```bash
   npm run dev
   ```
4. You should see text pop up saying:
   `Server running on port 5000`
   `Connected to MongoDB`
   *Leave this black terminal window completely alone. Do not close it!*

---

## 💻 Step 4: Start the Frontend Application (Your Screen)

Now you activate the visual component.

1. Open the `Axion` project folder again.
2. Open a **brand new** terminal inside the folder (just like you did in Step 3).
3. Follow these commands *exactly*, hitting **Enter** after each line:

   ```bash
   cd client
   ```

   ```bash
   npm install
   ```
   *This also takes a minute. It's downloading the frontend interface files.*

   ```bash
   npm run dev
   ```

4. You will see text pop up giving you a link, usually looking like:
   `➜  Local:   http://localhost:5173/`

5. Open your web browser (Google Chrome is highly recommended) and type `http://localhost:5173` into the web address bar.

**🎉 Congratulations! Axion should now be live on your screen.** Click "Sign Up", create an account, and enjoy the app.

---

## 📱 How to Deploy the Web App on Mobile Phones

If you want to demonstrate Axion to your professor on your mobile phone, you have two choices depending on how quickly you want to set it up:

### Choice A: Local Network Testing (Fastest & Easiest for Direct Demos)
This method only works if your Mobile Phone and your Computer are connected to the exact same Wi-Fi network.

1. Find your computer's local "IPv4 Address":
   - **Windows:** Open a terminal and type `ipconfig`. Look for "IPv4 Address" (e.g., `192.168.1.15`).
   - **Mac:** Hold the Option key and click your Wi-Fi menu icon. Look for "IP Address".
2. In the terminal running your Frontend (from Step 4), you must run it with this command instead of `npm run dev`:
   ```bash
   npm run dev -- --host
   ```
3. Look at your phone, connect to the exact same Wi-Fi.
4. Open your phone's browser (Safari/Chrome).
5. Type in the IPv4 address followed by `:5173`. For example: `http://192.168.1.15:5173`
6. Warning: Your phone browser might block camera access because `http` (not `https`) isn't fully secure. For a complete robust demo, you must use Choice B.

### Choice B: Cloud Deployment (Best for Production and Real-World Usage)
If you want anyone in the world to access the app on their phone anytime:

1. **Deploy the Database to MongoDB Atlas:**
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
   - Create a free cluster, whitelist IP address `0.0.0.0/0`, and grab your connection string (MongoDB URI).
2. **Deploy the Backend Server on Render:**
   - Create an account on [Render.com](https://render.com).
   - Link your GitHub repository.
   - Create a new "Web Service" specifying the `server` directory.
   - Add Environment Variables: `PORT` (leave empty/Render handles this), `MONGODB_URI` (paste from step 1).
3. **Deploy the Frontend on Vercel:**
   - Create an account on [Vercel](https://vercel.com).
   - Link your GitHub repository.
   - Import the project from your GitHub, but specifically point Vercel's "Root Directory" to the `client` folder.
   - Under Environment Variables, add `VITE_API_URL` linking to your shiny new Render backend address.
   - Hit "Deploy".

Once deployed to Vercel, you receive a link (e.g., `https://axion-project.vercel.app`). Open this link on any mobile phone in the world, and you have exactly what the professor needs to see!