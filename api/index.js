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

const settingsService = require('../services/settingsService');

// Global View Variables & Settings
app.use(async (req, res, next) => {
  const cookieHeader = req.headers.cookie || '';
  res.locals.isAdmin = cookieHeader.includes('admin_session=true') || (req.session && req.session.isAdmin);

  try {
    const settings = await settingsService.getSettings();
    res.locals.settings = settings;
    res.locals.cafeInfo = {
      address: settings.address,
      phone: settings.phone,
      phoneRaw: settings.phone_raw || settings.phone.replace(/\D/g, ''),
      hours: settings.working_hours,
      mapsUrl: settings.maps_url,
      instagramUrl: settings.instagram_url
    };
  } catch (err) {
    console.error('Settings middleware error:', err);
    res.locals.settings = settingsService.defaultSettings;
    res.locals.cafeInfo = {
      address: 'Dumlupınar, Sahaf Sk No:3 D:A, 34000 Pendik/İstanbul',
      phone: '0501 558 09 58',
      phoneRaw: '05015580958',
      hours: 'Her Gün: 09:00 - 23:30',
      mapsUrl: 'https://maps.app.goo.gl/a2nsSuwbPQ1amwEe7',
      instagramUrl: 'https://instagram.com/'
    };
  }
  next();
});

// Routes
app.use('/', publicRoutes);
app.use('/admin', adminRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).render('public/index', {
    title: 'Sayfa Bulunamadı | Qfi Cafe',
    featuredProducts: []
  });
});

module.exports = app;
