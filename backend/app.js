const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api', authRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Backend corriendo en http://localhost:${PORT}`));

