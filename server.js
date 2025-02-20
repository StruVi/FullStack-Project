const express = require('express');
const path = require('path');
const fileupload = require('express-fileupload');

let initial_path = path.join(__dirname, "public");

const app = express();
app.use(express.static(initial_path));
app.use(fileupload());

// ✅ Serve home.html for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(initial_path, "home.html"));
});

// ✅ Redirect /hub to /home.html (since they are merged)
app.get('/hub', (req, res) => {
    res.redirect('/home.html');
});

// ✅ Serve the editor page
app.get('/editor', (req, res) => {
    res.sendFile(path.join(initial_path, "editor.html"));
});

// ✅ Serve Sign-In Page
app.get('/signin', (req, res) => {
    res.sendFile(path.join(initial_path, "signin.html"));
});

// ✅ Serve Sign-Up Page
app.get('/signup', (req, res) => {
    res.sendFile(path.join(initial_path, "signup.html"));
});

// ✅ Serve individual blog pages
app.get("/blog/:id", (req, res) => {
    res.sendFile(path.join(initial_path, "blog.html"));
});

// ✅ Upload route
app.post('/upload', (req, res) => {
    if (!req.files || !req.files.image) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    let file = req.files.image;
    let date = new Date();
    let imagename = date.getDate() + date.getTime() + file.name;
    let uploadPath = path.join(__dirname, "public", "uploads", imagename);

    file.mv(uploadPath, (err) => {
        if (err) {
            console.error("Upload error:", err);
            return res.status(500).json({ error: "Failed to upload image" });
        }
        res.json({ path: `uploads/${imagename}` });
    });
});

// ✅ Handle 404 errors properly (serve a custom page or JSON response)
app.use((req, res) => {
    res.status(404).sendFile(path.join(initial_path, "404.html"));
});

// ✅ Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
