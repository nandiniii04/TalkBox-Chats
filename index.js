const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const Chat = require('./models/chat.js');
const methodOverride = require('method-override');

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(express.json()); // Parse JSON data
app.use(methodOverride('_method')); // For PUT/DELETE methods

// Database connection
main()
  .then(() => console.log("Connection successful"))
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/talkbox');
}

// Routes

// Home route
app.get('/', (req, res) => {
  res.send('TalkBox is working fine!');
});

// Get all chats
app.get('/chats', async (req, res) => {
  try {
    let chats = await Chat.find();
    console.log(chats);
    res.render("index.ejs", { chats });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving chats");
  }
});

// Show form for new chat
app.get('/chats/new', (req, res) => {
  res.render("new.ejs");
});

// Create new chat
app.post('/chats', async (req, res) => {
  try {
    const { from, to, message } = req.body;
    let newChat = new Chat({
      from: from,
      to: to,
      message: message,
      created_at: new Date()
    });
    await newChat.save();
    console.log("Chat saved:", newChat);
    res.redirect('/chats');
  } catch (err) {
    console.log(err);
    res.status(500).send("Error creating chat");
  }
});

// Show edit form
app.get('/chats/:id/edit', async (req, res) => {
  try {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs", { chat });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error loading chat");
  }
});

// Update chat
app.put('/chats/:id', async (req, res) => {
  try {
    let { id } = req.params;
    let { message } = req.body;
    let updatedChat = await Chat.findByIdAndUpdate(
      id,
      { message: message },
      { runValidators: true, new: true }
    );
    console.log("Chat updated:", updatedChat);
    res.redirect('/chats');
  } catch (err) {
    console.log(err);
    res.status(500).send("Error updating chat");
  }
});

// Delete chat
app.delete('/chats/:id', async (req, res) => {
  try {
    let { id } = req.params;
    let deletedChat = await Chat.findByIdAndDelete(id);
    console.log("Chat deleted:", deletedChat);
    res.redirect('/chats');
  } catch (err) {
    console.log(err);
    res.status(500).send("Error deleting chat");
  }
});

// Start server
app.listen(3000, () => console.log('TalkBox server running on port 3000'));