const express = require('express');
const db = require('./OracleDatabase/connectdb');
const app = express();
const port = 4000;
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const productRoutes = require('./routes/ProductRoutes');
const userRoutes = require('./routes/UserRoutes');

// Enable CORS middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, 
  
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
  secret: 'your_secret_key', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false,
    httpOnly: false,
    sameSite: true
    
   } 
}));

// Use routes
app.use('/products', productRoutes);
app.use('/user', userRoutes);

// Initialize database connection
db.initialize()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Failed to initialize database connection pool', err);
    process.exit(1);
  });



