const mongoose = require('mongoose');
const Chat = require('./models/chat.js');

main()
  .then(() => console.log("Connection successful"))
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Whatsapp');
  await insertChatsOnce();   // ✅ SAFE INSERT
}

async function insertChatsOnce() {
  const count = await Chat.countDocuments();

  if (count === 0) {
    const chats = [
      {
        from: "neha",
        to: "nandini",
        message: "hello nandini",
        created_at: new Date(),
      },
      {
        from: "nandini",
        to: "neha",
        message: "hi neha",
        created_at: new Date(),
      },
      {
        from: "neha",
        to: "nandini",
        message: "how are you?",
        created_at: new Date(),
      },
      {
        from: "nandini",
        to: "neha",
        message: "i am fine, thank you!",
        created_at: new Date(),
      },
    ];

    await Chat.insertMany(chats);
    console.log("Chats inserted once ✅");
  } else {
    console.log("Chats already exist, skipping insert ⏭️");
  }

  mongoose.connection.close(); // optional but clean
}
