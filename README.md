# 💬 Web Chat App

[![Live Demo](https://img.shields.io/badge/Live-Demo-green?style=flat-square)](https://web-chat-app-tfwd.onrender.com/)
[![GitHub stars](https://img.shields.io/github/stars/mayur777-ui/Web-chat-app?style=social)](https://github.com/mayur777-ui/Web-chat-app/stargazers)
[![Last Commit](https://img.shields.io/github/last-commit/mayur777-ui/Web-chat-app?style=flat-square)](https://github.com/mayur777-ui/Web-chat-app/commits/main)
[![Issues](https://img.shields.io/github/issues/mayur777-ui/Web-chat-app?style=flat-square)](https://github.com/mayur777-ui/Web-chat-app/issues)

A modern, full-stack **MERN Chat Application** for seamless, real-time conversations.  
_Instant messaging, secure authentication, robust profiles, and a beautiful, responsive UI—all in one app._

---

## ✨ Features

- **Real-Time Messaging** — Lightning-fast chat using Socket.IO
- **Secure Authentication** — Protected routes with JWT, password hashing
- **User Profiles** — Avatars, editable info, personalized experience
- **Conversation History** — Persistent chats (MongoDB)
- **Responsive UI** — Mobile-friendly and accessible
- **Modern Tech Stack** — React, Node.js, Express, MongoDB

---

## 📸 Preview

> _Add your screenshots here for login, chat window, user profile, etc._  
> ![Chat UI screenshot](#) <!-- Replace # with your image URL -->

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16+)
- **MongoDB** (local or Atlas cloud)

### 1. Clone the Repository

```bash
git clone https://github.com/mayur777-ui/Web-chat-app.git
cd Web-chat-app
```

### 2. Configure Environment

Inside `/Backend`, create a `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 3. Install & Run

#### Backend

```bash
cd Backend
npm install
npm start
```

#### Frontend

```bash
cd ../Frontend
npm install
npm start
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:5000](http://localhost:5000) (API)

---

## 🗂️ Project Structure

```
Web-chat-app/
├── Backend/    # Express API, MongoDB, Auth, Sockets
├── Frontend/   # React App, Components, Styling
└── README.md
```

---

## ⚙️ Tech Stack

- **Frontend:** React, React Router, Context API, CSS
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, Socket.IO, bcrypt
- **Dev Tools:** Render (deployment), dotenv, nodemon

---

## 👥 Community & Contribution

Contributions are welcome!  
Whether it’s a bug, feature request, or new idea—[open an issue](https://github.com/mayur777-ui/Web-chat-app/issues) or submit a pull request!

1. Fork the repo
2. Create a branch (`git checkout -b feature/your-feature`)
3. Commit (`git commit -m "Add feature"`)
4. Push (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 🛠️ Troubleshooting

- **Frontend/Backend not connecting?**  
  Check API endpoint URLs and ensure both servers are running.

- **MongoDB connection errors?**  
  Verify your `MONGO_URI` and database permissions.

- **Socket.IO issues?**  
  Ensure correct CORS settings and both servers are on.

---

## 📅 Future Implementation

- [ ] Group chats
- [ ] Typing indicators
- [ ] Read receipts
- [ ] File/image sharing
---

## 📜 License

MIT License — see [`LICENSE`](LICENSE) for details.

---

## 🙋‍♂️ Author

- **mayur777-ui** — [GitHub profile](https://github.com/mayur777-ui)

> _If you like this project, please ⭐ star it!_
