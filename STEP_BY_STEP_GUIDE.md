# 🎬 GUIDE D'EXÉCUTION - ÉTAPES PAS À PAS

## 📋 Checklist Complète

- [ ] Étape 1: Exécuter script SQL
- [ ] Étape 2: Recompiler backend
- [ ] Étape 3: Redémarrer services
- [ ] Étape 4: Mettre à jour frontend
- [ ] Étape 5: Tester et vérifier

---

## 🔴 ÉTAPE 1: EXÉCUTER LE SCRIPT SQL (5 min)

### Option A: Via MySQL CLI (Recommandé)

```powershell
# Ouvrir PowerShell et naviguer au dossier
cd C:\Users\SP\Downloads\formation

# Exécuter le script SQL
mysql -u root -p formation_db < database\migrations\2026-04-23_populate_sample_data.sql

# Quand demandé: Taper votre mot de passe MySQL
```

### Option B: Via MySQL Workbench

1. Ouvrir MySQL Workbench
2. Double-cliquer sur votre connexion
3. Clic-droit sur la base `formation_db`
4. Sélectionner **"Import"**
5. Parcourir vers `database\migrations\2026-04-23_populate_sample_data.sql`
6. Cliquer **"Import"**

### Option C: Via phpMyAdmin

1. Aller sur http://localhost/phpmyadmin
2. Sélectionner la base `formation_db`
3. Cliquer sur l'onglet **"Import"**
4. Sélectionner le fichier SQL
5. Cliquer **"Import"**

### ✅ Vérifier que ça a fonctionné:

```sql
-- Exécuter dans MySQL Workbench ou CLI
USE formation_db;

SELECT COUNT(*) as formations FROM formation;
-- Devrait afficher: 40+ (environs 40 formations)

SELECT COUNT(*) as participants FROM participant;
-- Devrait afficher: 50+ (environs 50 participants)

SELECT COUNT(*) as domaines FROM domaine;
-- Devrait afficher: 6

SELECT COUNT(*) as formateurs FROM formateur;
-- Devrait afficher: 15

SELECT COUNT(*) as structures FROM structure;
-- Devrait afficher: 7
```

---

## 🔵 ÉTAPE 2: RECOMPILER LE BACKEND (10 min)

```powershell
# Ouvrir PowerShell ET y rester durant toute la compilation

# 1. Naviguer au dossier projet
cd C:\Users\SP\Downloads\formation

# 2. Nettoyer et recompiler (première fois = plus long)
.\gradlew.bat clean build

# OU si vous avez Gradle en PATH:
gradle clean build

# Attend qu'il affiche:
# BUILD SUCCESSFUL in XXXs
```

**Si erreur "Java not found":**
```powershell
# Vérifier Java est installé
java -version

# Si pas d'erreur, continuer. Sinon télécharger Java 11+
```

**Si build fails à cause de tests:**
```powershell
# Sauter les tests
.\gradlew.bat clean build -x test
```

---

## 🟢 ÉTAPE 3: REDÉMARRER LES SERVICES (5 min)

### 🖥️ Terminal 1 - BACKEND

```powershell
# PowerShell 1 - Toujours ouverte

cd C:\Users\SP\Downloads\formation

# Démarrer Spring Boot
.\gradlew.bat bootRun

# OU si vous êtes en IntelliJ:
# - Clic-droit sur main() dans Application.java
# - Sélectionner "Run"
```

**Attendre le log:**
```
Tomcat started on port(s): 8081 (http)
```

### 🌐 Terminal 2 - FRONTEND

```powershell
# PowerShell 2 - Ouvrir NOUVELLE fenêtre

cd C:\Users\SP\Downloads\formation\frontend

# Option A: npm
npm run dev

# Option B: pnpm (recommandé, plus rapide)
pnpm run dev

# Attendre:
# ▲ Next.js 13.4.x
# Local: http://localhost:3000
```

---

## 🟡 ÉTAPE 4: METTRE À JOUR LE FRONTEND (15 min)

### 📝 Ouvrir le fichier:
`frontend/components/dashboard/formations-dashboard.tsx`

### 1️⃣ Ajouter l'import en haut:

```typescript
import { useDashboardData } from '@/hooks/useDashboardData';
```

### 2️⃣ Remplacer la déclaration d'état:

**AVANT:**
```typescript
const [overview, setOverview] = useState(null);
const [domaines, setDomaines] = useState([]);
const [directions, setDirections] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    // ... 50 lignes de code ...
  };
  fetchData();
}, []);
```

**APRÈS:**
```typescript
const { data: dashboardData, loading, error, refresh } = useDashboardData();

// Déstructurer les données du hook
const overview = dashboardData?.overview;
const domaines = dashboardData?.formationsParDomaine?.map((d: any) => ({
  name: d.label,
  pct: 0
})) || [];
const directions = dashboardData?.participantsParStructure?.map((d: any) => ({
  name: d.label,
  participants: d.value || 0
})) || [];
```

### 3️⃣ Ajouter gestion du loading:

```typescript
if (loading) {
  return (
    <div style={{ padding: '20px' }}>
      <div className="space-y-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-20 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    </div>
  );
}
```

### 4️⃣ Ajouter gestion de l'erreur:

```typescript
if (error) {
  return (
    <div style={{
      background: '#fee2e2',
      border: '1px solid #fecaca',
      color: '#991b1b',
      padding: '16px',
      borderRadius: '8px'
    }}>
      <div style={{ fontWeight: 'bold' }}>⚠️ Erreur</div>
      <div>{error}</div>
      <button onClick={refresh} style={{ marginTop: '12px' }}>
        🔄 Réessayer
      </button>
    </div>
  );
}
```

### 5️⃣ Ajouter bouton refresh optionnel:

```typescript
return (
  <div style={{ padding: '20px' }}>
    <button
      onClick={refresh}
      style={{
        marginBottom: '16px',
        padding: '8px 16px',
        background: '#4f46e5',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      🔄 Rafraîchir
    </button>
    
    {/* Tout le reste du composant reste pareil... */}
  </div>
);
```

### ✅ Sauvegarder le fichier: `Ctrl+S`

---

## 🟣 ÉTAPE 5: TESTER ET VÉRIFIER (10 min)

### 1️⃣ Ouvrir le Dashboard

```
http://localhost:3000/admin
```

**Vous devriez voir:**
- ✅ 4 cartes KPI avec les nombres (40+ formations, 50+ participants, etc.)
- ✅ Graphiques avec les données
- ✅ Zéro erreur dans la console

### 2️⃣ Ouvrir Chrome DevTools (F12)

### 3️⃣ Onglet **Console**

Chercher les logs:
```
🌐 Fetching dashboard data from API...
✅ Data loaded in 150ms
```

Cela signifie que les données ont été chargées depuis l'API.

### 4️⃣ Rafraîchir la page (F5)

Chercher le log:
```
📦 Using cached data
```

Cela signifie que le cache fonctionne!

### 5️⃣ Onglet **Network**

- Avant: Voir 3 requêtes API
- Après: Voir 1 requête `/dashboard-data`

La durée devrait passer de 300-400ms à 100-150ms.

### 6️⃣ Onglet **Application** (ou **Storage**)

- Aller à **LocalStorage**
- Cliquer sur `http://localhost:3000`
- Chercher la clé `dashboard_cache`

Vous devriez voir:
```json
{
  "data": {
    "overview": {...},
    "formationsParDomaine": [...],
    "participantsParStructure": [...]
  },
  "timestamp": 1234567890,
  "version": "v1"
}
```

---

## 🎉 C'EST FAIT!

Si vous voyez tout ça: ✅✅✅

```
✅ Dashboard affiche les données
✅ Logs de performance apparaissent
✅ Cache fonctionne (localStorage)
✅ Une seule requête API utilisée
✅ Latence < 150ms
```

---

## 🚨 Problèmes Courants & Solutions

### ❌ "Base de données vide"

```sql
-- Vérifier les données existent
SELECT * FROM formation LIMIT 1;
SELECT * FROM participant LIMIT 1;

-- Si vide, réexécuter le script SQL
```

### ❌ "Erreur 401 ou 403"

- Vérifier token JWT dans localStorage (F12 → Application)
- Se reconnecter avec un compte ADMINISTRATEUR ou RESPONSABLE
- Vérifier le token n'est pas expiré

### ❌ "Module 'hooks' not found"

- Vérifier le chemin: `@/hooks/useDashboardData`
- Vérifier que le fichier existe: `frontend/hooks/useDashboardData.ts`
- Redémarrer le serveur frontend

### ❌ "Cache ne fonctionne pas"

- Ouvrir DevTools (F12)
- Application → LocalStorage → http://localhost:3000
- Vérifier que la clé `dashboard_cache` existe
- Si vide: Rafraîchir la page une fois

### ❌ "Compilation backend failed"

```bash
# Nettoyer et réessayer
./gradlew.bat clean

# Puis rebuild
./gradlew.bat build -x test
```

---

## 📞 Support

Si vous êtes bloqué, vérifier dans cet ordre:

1. ✅ Script SQL exécuté? (`SELECT COUNT(*) FROM formation;`)
2. ✅ Backend recompilé? (`./gradlew.bat clean build`)
3. ✅ Services redémarrés? (Backend + Frontend)
4. ✅ Frontend mis à jour? (Fichier formations-dashboard.tsx modifié)
5. ✅ Navigateur rafraîchi? (Ctrl+Shift+R pour hard refresh)

---

## 🎯 Résumé Commandes

```powershell
# SQL
mysql -u root -p formation_db < database\migrations\2026-04-23_populate_sample_data.sql

# Backend - Compilation
cd C:\Users\SP\Downloads\formation
.\gradlew.bat clean build

# Backend - Exécution
.\gradlew.bat bootRun

# Frontend - Exécution
cd frontend
npm run dev

# Tester
http://localhost:3000/admin
```

---

**Temps total: ~30-40 min pour les 5 étapes**

Bon développement! 🚀

