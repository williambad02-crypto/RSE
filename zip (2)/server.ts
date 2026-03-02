import express from 'express';
import { createServer as createViteServer } from 'vite';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import db from './src/db/database';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-prod';

app.use(express.json());
app.use(cookieParser());

// --- API Routes ---

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, companyName } = req.body;
    
    if (!email || !password || !companyName) {
      return res.status(400).json({ error: 'Tous les champs sont requis.' });
    }

    const existingUser = db.prepare('SELECT id, is_verified FROM users WHERE email = ?').get(email) as any;
    if (existingUser) {
      if (existingUser.is_verified) {
        return res.status(409).json({ error: 'Cet email est déjà utilisé.' });
      } else {
        // Allow re-registration for unverified users: update password and token
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = uuidv4();
        db.prepare('UPDATE users SET password_hash = ?, verification_token = ?, company_name = ? WHERE id = ?').run(hashedPassword, verificationToken, companyName, existingUser.id);
        
        const baseUrl = process.env.APP_URL || `http://localhost:${PORT}`;
        const verificationLink = `${baseUrl}/verify-email?token=${verificationToken}`;

        console.log('---------------------------------------------------');
        console.log(`📧 NOUVEAU LIEN DE VÉRIFICATION POUR ${email}`);
        console.log(`Lien : ${verificationLink}`);
        console.log('---------------------------------------------------');

        return res.json({ message: 'Un nouveau lien de vérification a été envoyé.', verificationLink });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    const verificationToken = uuidv4();

    db.prepare('INSERT INTO users (id, email, password_hash, company_name, verification_token, is_verified) VALUES (?, ?, ?, ?, ?, 0)').run(userId, email, hashedPassword, companyName, verificationToken);

    // Use the dynamic app URL if available, otherwise fallback to localhost
    const baseUrl = process.env.APP_URL || `http://localhost:${PORT}`;
    const verificationLink = `${baseUrl}/verify-email?token=${verificationToken}`;

    // Simulate Email Sending
    console.log('---------------------------------------------------');
    console.log(`📧 EMAIL DE VÉRIFICATION POUR ${email}`);
    console.log(`Lien : ${verificationLink}`);
    console.log('---------------------------------------------------');

    res.json({ message: 'Inscription réussie. Veuillez vérifier vos emails.', verificationLink });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Erreur serveur lors de l\'inscription.' });
  }
});

// Verify Email
app.post('/api/auth/verify-email', (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) return res.status(400).json({ error: 'Token manquant.' });

    const user = db.prepare('SELECT * FROM users WHERE verification_token = ?').get(token) as any;
    
    if (!user) {
      return res.status(400).json({ error: 'Token invalide ou expiré.' });
    }

    db.prepare('UPDATE users SET is_verified = 1, verification_token = NULL WHERE id = ?').run(user.id);

    // Auto-login after verification
    const jwtToken = jwt.sign({ userId: user.id, email: user.email, companyName: user.company_name }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', jwtToken, { 
      httpOnly: true, 
      secure: true, 
      sameSite: 'none', 
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });

    res.json({ message: 'Email vérifié avec succès.', user: { id: user.id, email: user.email, companyName: user.company_name } });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ error: 'Erreur lors de la vérification.' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis.' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (!user) {
      return res.status(401).json({ error: 'Identifiants invalides.' });
    }

    if (!user.is_verified) {
      return res.status(403).json({ error: 'Veuillez vérifier votre email avant de vous connecter.' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Identifiants invalides.' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email, companyName: user.company_name }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, { 
      httpOnly: true, 
      secure: true, 
      sameSite: 'none', 
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });
    res.json({ message: 'Connexion réussie', user: { id: user.id, email: user.email, companyName: user.company_name } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la connexion.' });
  }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Déconnexion réussie' });
});

// Middleware Auth
const authenticateToken = (req: any, res: any, next: any) => {
  const token = req.cookies.token;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Get User Data (Project)
app.get('/api/data', authenticateToken, (req: any, res) => {
  try {
    const project = db.prepare('SELECT data FROM projects WHERE user_id = ?').get(req.user.userId) as any;
    if (project) {
      res.json(JSON.parse(project.data));
    } else {
      res.json(null); // No project yet
    }
  } catch (error) {
    console.error('Get data error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
  }
});

// Save User Data (Project)
app.post('/api/data', authenticateToken, (req: any, res) => {
  try {
    const data = JSON.stringify(req.body);
    const existingProject = db.prepare('SELECT id FROM projects WHERE user_id = ?').get(req.user.userId);

    if (existingProject) {
      db.prepare('UPDATE projects SET data = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?').run(data, req.user.userId);
    } else {
      const projectId = uuidv4();
      db.prepare('INSERT INTO projects (id, user_id, data) VALUES (?, ?, ?)').run(projectId, req.user.userId, data);
    }

    res.json({ message: 'Données sauvegardées avec succès.' });
  } catch (error) {
    console.error('Save data error:', error);
    res.status(500).json({ error: 'Erreur lors de la sauvegarde des données.' });
  }
});

// --- Vite Middleware ---

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
