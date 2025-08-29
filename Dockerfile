# Utilise l'image officielle Node.js
FROM node:20

# Crée le dossier de l'app
WORKDIR /app

# Copie les fichiers package
COPY server/package*.json ./

# Installe les dépendances
RUN npm install

# Copie le code source
COPY server/ .

# Expose le port
EXPOSE 3000

# Commande de démarrage
CMD ["npm", "start"]
