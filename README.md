<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Chat Web App - README</title>
</head>
<body>
  <h1>⚡ Chat Web App — Optimized with Huffman Compression</h1>

  <p>A real-time chat application that supports user authentication and leverages <strong>Huffman Coding</strong> for efficient, low-bandwidth message transmission. Architected with <strong>Yarn Workspaces</strong> to maintain a modular and scalable monorepo.</p>

  <hr />

  <h2>📁 Project Structure</h2>
  <pre>
Chat-Web-App/
├── Backend/            # Node.js + Express backend
├── Frontend/           # React frontend
├── shared-huffman/     # Shared Huffman utilities (local package)
├── .yarn/              # Yarn modern workspace directory
├── package.json        # Root workspace config
├── yarn.lock
└── .yarnrc.yml
  </pre>

  <hr />

  <h2>🚀 Features</h2>
  <ul>
    <li>🔐 Secure user authentication (JWT-based)</li>
    <li>💬 Real-time messaging (Socket.IO)</li>
    <li>⚡ Huffman message compression</li>
    <li>📦 Monorepo with Yarn Workspaces</li>
    <li>♻️ Shared encoding/decoding logic across frontend/backend</li>
    <li>🌐 Responsive and modern React UI</li>
  </ul>

  <hr />

  <h2>🛠️ Technologies Used</h2>
  <ul>
    <li><strong>Frontend:</strong> React.js, Tailwind CSS, Axios</li>
    <li><strong>Backend:</strong> Node.js, Express, MongoDB, Mongoose</li>
    <li><strong>Realtime Communication:</strong> Socket.IO</li>
    <li><strong>Compression:</strong> Custom Huffman encoder/decoder</li>
    <li><strong>Package Management:</strong> Yarn Workspaces</li>
  </ul>

  <hr />

  <h2>🧑‍💻 Getting Started</h2>

  <h3>1. Clone the repository</h3>
  <pre><code>git clone https://github.com/mayur777-ui/Web-chat-app.git
cd Web-chat-app</code></pre>

  <h3>2. Install all workspace dependencies</h3>
  <pre><code>yarn install</code></pre>

  <h3>3. Set up environment variables</h3>
  <p>Create a <code>.env</code> file inside the <code>Backend/</code> directory:</p>
  <pre><code>PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key</code></pre>

  <hr />

  <h2>📦 Running the App</h2>

  <h3>Start the backend server</h3>
  <pre><code>yarn workspace Backend run dev</code></pre>

  <h3>Start the frontend</h3>
  <pre><code>yarn workspace Frontend run dev</code></pre>

  <p>Then open: <a href="http://localhost:3000" target="_blank">http://localhost:3000</a></p>

  <hr />

  <h2>🧠 About Huffman Compression</h2>
  <p>Messages are encoded before storing/sending and decoded on the client:</p>
  <ul>
    <li><strong>Backend:</strong>
      <ul>
        <li>Builds a frequency map of message content</li>
        <li>Generates a Huffman tree</li>
        <li>Encodes the content</li>
        <li>Stores only the encoded string and tree (in-memory or temporarily)</li>
      </ul>
    </li>
    <li><strong>Frontend:</strong>
      <ul>
        <li>Receives encoded message and Huffman tree</li>
        <li>Decodes message before display using <code>shared-huffman</code> utility</li>
      </ul>
    </li>
  </ul>

  <hr />

  <h2>🧩 Contributing</h2>
  <ol>
    <li>Fork the repository</li>
    <li>Create a new feature branch:
      <pre><code>git checkout -b feature/my-awesome-feature</code></pre>
    </li>
    <li>Commit your changes and push</li>
    <li>Open a Pull Request</li>
  </ol>

  <hr />

  <h2>📄 License</h2>
  <p>This project is licensed under the <strong>MIT License</strong>. See the <a href="LICENSE">LICENSE</a> file for details.</p>

  <hr />

  <p>🚀 Built with ❤️ and Huffman logic by <a href="https://github.com/mayur777-ui" target="_blank">Mayur</a></p>
</body>
</html>
