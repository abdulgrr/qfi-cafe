const express = require('express');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const publicRoutes = require('../routes/publicRoutes');
const adminRoutes = require('../routes/adminRoutes');

const app = express();

// View Engine Setup (Path configured relative to process.cwd() for Vercel compatibility)
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Files
app.use('/public', express.static(path.join(process.cwd(), 'public')));
app.use(express.static(path.join(process.cwd(), 'public')));

// Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'butik_cafe_default_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 1 Day
    }
  })
);

// Global View Variables
app.use((req, res, next) => {
  const cookieHeader = req.headers.cookie || '';
  res.locals.isAdmin = cookieHeader.includes('admin_session=true') || (req.session && req.session.isAdmin);
  next();
});

// Routes
app.use('/', publicRoutes);
app.use('/admin', adminRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).render('public/index', {
    title: 'Sayfa Bulunamadı | Qfi Coffee',
    featuredProducts: []
  });
});

module.exports = app;
