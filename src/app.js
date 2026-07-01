const express = require('express');
const plantsRouter = require('./routes/plants');
const categoriesRouter = require('./routes/categories');

const app = express();

app.use(express.json());

app.use('/plants', plantsRouter);
app.use('/categories', categoriesRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API Plant DB 🌿' });
});

// Route inconnue -> 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée.' });
});

module.exports = app;