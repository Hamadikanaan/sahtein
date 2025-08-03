# 🍕 Sahtein Food Delivery Platform

> **Modern Food Delivery Platform for Syrian Restaurants**

[![Angular](https://img.shields.io/badge/Angular-20-red)](https://angular.io/) [![Flask](https://img.shields.io/badge/Flask-3.0-blue)](https://flask.palletsprojects.com/) [![Status](https://img.shields.io/badge/Status-Production%20Ready-green)](https://github.com/Hamadikanaan/sahtein)

## 🔥 **Projekt-Übersicht**

**Sahtein** (صحتين) ist eine vollständige Food-Delivery-Plattform speziell für syrische Restaurants. Die App verbindet Restaurant-Besitzer mit Kunden in 25+ syrischen Städten und bietet ein komplettes Restaurant-Management-System mit modernem Design.

**Was macht es besonders:**
- 🇸🇾 **Syrischer Fokus** - Kulturell angepasst, RTL-Support
- 📱 **Mobile-First** - Responsive Design für alle Geräte  
- 🏪 **Complete Workflows** - Registration → Approval → Management
- ⚡ **Modern Tech** - Angular 20 + Flask + JWT

## ⚡ **Quick Start (5 Minuten)**

```bash
# 1. Repository klonen
git clone https://github.com/Hamadikanaan/sahtein.git
cd sahtein

# 2. Backend starten
cd backend
pip install -r requirements.txt
python migrations/correct_fix.py
python app.py

# 3. Frontend starten (neues Terminal)
cd frontend/sahtein-simple
npm install
ng serve

# 4. App öffnen: http://localhost:4200
```

**Login-Daten:**
- **Admin**: admin@admin.com / admin123
- **Restaurant**: Nach Registrierung → Genehmigung

## 🛠️ **Tech Stack**

| Frontend | Backend | Database |
|----------|---------|----------|
| Angular 20 | Flask (Python) | SQLite/PostgreSQL |
| TypeScript | SQLAlchemy ORM | JWT Auth |
| RxJS | JWT Security | bcrypt |
| Custom CSS | RESTful API | CORS |

## 📱 **Features**

### **Customer (Kunden)**
- ✅ Restaurant suchen & filtern (Stadt, Kategorie)
- ✅ Menüs durchstöbern & bestellen
- ✅ Warenkorb & Checkout
- ✅ Bestellhistorie

### **Restaurant Owner (Besitzer)**
- ✅ Restaurant registrieren & verwalten
- ✅ Komplettes Menü-Management
- ✅ Bestellungen verarbeiten
- ✅ Dashboard mit Statistiken

### **Admin (Verwaltung)**
- ✅ Restaurant-Anträge genehmigen/ablehnen
- ✅ System-Übersicht
- ✅ Benutzer-Management

## 👥 **User Roles**

| Role | Login | Funktionen |
|------|-------|------------|
| **Kunde** 👥 | customer@email.com | Bestellen, browsen, Profile |
| **Restaurant** 🏪 | restaurant@restaurant.com | Menü verwalten, Bestellungen |
| **Admin** 👑 | admin@admin.com | Genehmigungen, System-Control |

## 📊 **Status**

### ✅ **Production Ready (90%)**
- **Authentication** - Complete JWT system
- **Restaurant Management** - Full CRUD operations  
- **Menu System** - Category-based with stats
- **Admin Panel** - Application approval workflow
- **Responsive Design** - Mobile/Tablet/Desktop
- **API Integration** - All endpoints functional

### 🔄 **In Development (10%)**
- Payment Gateway (UI ready)
- File Upload (Structure ready)
- Email Notifications (SMTP needed)

### 🎯 **Syrian Cities Support**
**25+ Städte**: Damascus, Aleppo, Homs, Hama, Latakia, Deir ez-Zor, Raqqa, Daraa, As-Suwayda, Quneitra, Tartus, Al-Hasakah, Manbij, Qamishli, und mehr...

## 📁 **Struktur**

```
sahtein/
├── backend/           # Flask API
│   ├── app/models/    # Database Models
│   ├── app/routes/    # API Endpoints
│   └── migrations/    # DB Setup
├── frontend/sahtein-simple/  # Angular App
│   ├── src/app/pages/        # Page Components
│   ├── src/app/services/     # API Services
│   └── src/app/guards/       # Route Protection
└── docs/             # Documentation PDF
```

## 🚀 **Deployment Ready**

- **Development**: `ng serve` + `python app.py`
- **Production**: Docker + Nginx ready
- **Database**: SQLite → PostgreSQL migration path
- **Security**: JWT + bcrypt + CORS configured

## 📧 **Contact**

- **Developer**: Hamadi Kanaan
- **GitHub**: [@Hamadikanaan](https://github.com/Hamadikanaan)
- **Issues**: [GitHub Issues](https://github.com/Hamadikanaan/sahtein/issues)

---

**⭐ Star this repo if you find it useful!**

*Made with ❤️ for the Syrian community*
