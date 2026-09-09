const express = require('express');
const app = express();
const port = 3000;
let mysql = require('mysql2');
const cors = require('cors');

const path = require('path');

app.use(cors());
app.use(express.json());
// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req,res) => {
    res.send('Hello World')
})

const productRoute = require('./src/route/product.route');
const userRoute = require('./src/route/user.route');
productRoute(app);
userRoute(app);

app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
  credentials: true
}));

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})
