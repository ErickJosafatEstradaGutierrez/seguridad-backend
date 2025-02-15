const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(express.json()); // Middleware para leer JSON

// Usuarios en hardcoding
const users = [
  { username: "admin", password: "admin123" },
  { username: "user", password: "user123" }
];

// Clave secreta para JWT
const SECRET_KEY = process.env.SECRET_KEY || "supersecret";

const cors = require("cors");
app.use(cors({
  origin: "http://localhost:3001",  // Permite solo peticiones desde tu frontend
  methods: ["POST"],  // Permite solo POST
  allowedHeaders: ["Content-Type"],  // Permite solo este header
}));

// Endpoint de login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Validar que los campos no sean vacíos
  if (!username || !password) {
    return res.status(400).json({ statusCode: 400, message: "Campos requeridos" });
  }

  // Buscar usuario
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ statusCode: 401, message: "Credenciales incorrectas" });
  }

  // Generar token con expiración de 1 minuto
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1m" });

  res.json({ statusCode: 200, message: "Login exitoso", token });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
