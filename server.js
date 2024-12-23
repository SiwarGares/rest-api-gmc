const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config({ path: './config/.env' });

// Initialiser Express
const app = express();

// Middleware pour analyser les requêtes JSON
app.use(express.json());

// Connecter à MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Base de données connectée avec succès'))
    .catch((err) => console.error('Erreur de connexion à la base de données:', err));


// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur en cours d'exécution sur le port ${PORT}`));

const User = require('./models/User');

// GET : Retourner tous les utilisateurs
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs.' });
    }
});

// POST : Ajouter un nouvel utilisateur
app.post('/users', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de l’ajout de l’utilisateur.' });
    }
});

// PUT : Éditer un utilisateur par ID
app.put('/users/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l’utilisateur.' });
    }
});

// DELETE : Supprimer un utilisateur par ID
app.delete('/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Utilisateur supprimé avec succès.' });
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la suppression de l’utilisateur.' });
    }
});
