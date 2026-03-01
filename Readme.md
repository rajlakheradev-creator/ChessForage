
♟️ ChessForage



📝 Description

ChessForage is a streamlined web application built on the Express.js framework, designed for chess enthusiasts to efficiently discover, play, and curate chess-related content. Whether you're tracking game histories, analyzing moves, or searching for tactical insights, ChessForage provides a responsive and immersive platform to enhance your chess study and gameplay experience.


---

🌐 Live Demo

🚀 Play Now:
👉 https://chessforage.onrender.com/game.html


---

✨ Features

♟️ Interactive Chess Board

🤖 Play against Bot

🔐 User Authentication (JWT-based)

📜 Move History Tracking

🔊 Dynamic Sound System

🎨 Custom Chess Piece Assets

🧠 Powered by chess.js for move validation



---

🛠️ Tech Stack

🚀 Express.js

🗄️ MongoDB (via Mongoose)

🔐 JWT Authentication

🎮 Chess.js

🎨 Vanilla JS + HTML + CSS



---

📦 Key Dependencies

bcryptjs: ^3.0.3
chess.js: ^1.4.0
cors: ^2.8.6
dotenv: ^17.3.1
express: ^5.2.1
jsonwebtoken: ^9.0.3
mongoose: ^9.2.2


---

🚀 Run Commands

Install Dependencies

npm install

Run Server

node js/server.js

Run Tests

npm run test


---

📁 Project Structure

.
├── images/
├── assets/sounds/
├── css/
├── js/
│   ├── server.js
│   ├── board.js
│   ├── bot.js
│   ├── game-control.js
│   ├── login.js
│   ├── signup.js
│   └── ...
├── middleware/
│   └── authMiddleware.js
├── routes/
│   └── auth.js
├── Index.html
├── login.html
├── signup.html
└── package.json


---

🔐 Authentication Flow

User Signup → Password hashed with bcryptjs

User Login → JWT token generated

Protected Routes → Verified via middleware (authMiddleware.js)



---

👥 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository


2. Clone your fork

git clone https://github.com/rajlakheradev-creator/ChessForage.git


3. Create a new branch

git checkout -b feature/your-feature


4. Commit your changes

git commit -m "Add some feature"


5. Push to your branch

git push origin feature/your-feature


6. Open a pull request




---

📜 License

This project is licensed under the ISC License.


---

