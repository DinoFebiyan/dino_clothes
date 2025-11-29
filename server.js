require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const {authenticateToken, authorizeRole} = require('./middleware/auth.js');
const app = express();
const PORT = process.env.PORT || 3100;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send(`
    Selamat datang di API dino_clothes!
    untuk bisa mengakses data produk kami gunakan endpoint /products atau /products/:sku untuk data spesifik produk.
  `);
});

app.get('/status', (req, res) => {
  res.json({ ok: true, service: 'aman poll, jos jis' });
});

app.post('/register-admin', [authenticateToken, authorizeRole('owner')], async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password || password.length < 6) {
    return res.status(400).json({ error: 'Username dan password (min 6 char) harus diisi' });
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const sql = 'INSERT INTO users(username, password, role) VALUES($1, $2, $3) RETURNING id, username';
    const result = await db.query(sql, [username.toLowerCase(), hashedPassword, 'warehouseAdmin']);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Username sudah digunakan' });
    }
    next(err);
  }
});

app.post('/register-owner', async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password || password.length < 6) {
    return res.status(400).json({ error: 'Username dan password (min 6 char) harus diisi' });
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const sql = 'INSERT INTO users(username, password, role) VALUES($1, $2, $3) RETURNING id, username';
    const result = await db.query(sql, [username.toLowerCase(), hashedPassword, 'owner']);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Username sudah digunakan' });
    }
    next(err);
  }
});

app.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const sql = 'SELECT * FROM users WHERE username = $1';
    const result = await db.query(sql, [username.toLowerCase()]);
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ error: 'Kredensial tidak valid' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Kredensial tidak valid' });
    }
    const payload = { user: { id: user.id, username: user.username, role: user.role } };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login berhasil', token: token });
  } catch (err) {
    next(err);
  }
});

app.get('/products', async (req, res, next) => {
  const sql = `
    SELECT sku, productName, price, isAvailable
    FROM products
  `;
  try {
    const result = await db.query(sql);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

app.get('/products/:sku', async (req, res, next) => {
  const sql = `
    SELECT sku, productName, price, isAvailable
    FROM products
    WHERE sku = $1
  `;
  try {
    const result = await db.query(sql, [req.params.sku]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product tidak ditemukan' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

app.post('/products/tambahProducts', [authenticateToken, authorizeRole('owner')], async (req, res, next) => {
  const { sku, productName, price } = req.body;
  if (!sku || !productName || !price) {
    return res.status(400).json({ error: 'sku, productName, price wajib diisi' });
  }
  const sql = 'INSERT INTO products(sku, productName, price) VALUES($1, $2, $3) RETURNING *';
  try {
    const result = await db.query(sql, [sku, productName, price]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

app.put('/products/editProduct/:sku', [authenticateToken, authorizeRole('owner')], async (req, res, next) => {
  const { sku, productName, price, } = req.body;
  const sql = 'UPDATE products SET sku = $1, productName = $2, price = $3 WHERE sku = $4 RETURNING *';
  try {
    const result = await db.query(sql, [sku, productName, price, req.params.sku]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Product tidak ditemukan' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

app.put('/products/editStock/:sku', [authenticateToken, authorizeRole('warehouseAdmin')], async (req, res, next) => {
  const { isAvailable } = req.body;
  const sql = 'UPDATE products SET isAvailable= $1 WHERE sku = $2 RETURNING *';
  try {
    const result = await db.query(sql, [isAvailable, req.params.sku]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Product tidak ditemukan' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

app.delete('/products/:sku', [authenticateToken, authorizeRole('owner')], async (req, res, next) => {
  const sql = 'DELETE FROM products WHERE sku = $1 RETURNING *';
  try {
    const result = await db.query(sql, [req.params.sku]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Product tidak ditemukan' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

//===FALLBACK & ERROR HANDLING===
app.use((req, res) => {
  res.status(404).json({ error: 'Rute tidak ditemukan' });
});

app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err.stack);
  res.status(500).json({ error: 'Terjadi kesalahan pada server' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server aktif di http://localhost:${PORT}`);
});
