# Sahtein Food Delivery Platform - Erweiterte Projekt-Dokumentation

## Projekt Übersicht

**Sahtein** ist eine umfassende Food-Delivery-Plattform, speziell entwickelt für syrische Restaurants und Küche. Die Plattform ermöglicht es Restaurant-Besitzern, ihre Betriebe zu registrieren, Menüs zu verwalten und Bestellungen von Kunden in syrischen Städten zu erhalten.

### Neue Features (Stand: Juli 2025)
- ✅ **Automatische E-Mail-Generierung**: Restaurant-Admins erhalten automatisch E-Mails im Format `restaurant_name@restaurant.com`
- ✅ **Verbessertes Login-System**: Unterstützt sowohl E-Mail als auch Username-Login
- ✅ **Admin-Panel Verbesserungen**: Zeigt korrekte Login-Daten für Restaurant-Besitzer
- ✅ **Erweiterte Datenbank-Struktur**: E-Mail-Feld für alle Admin-Accounts

---

## Technologie Stack

### Backend
- **Framework**: Flask (Python)
- **Datenbank**: SQLite mit SQLAlchemy ORM
- **Authentifizierung**: Flask-JWT-Extended mit Role-based Access
- **Password Security**: Werkzeug Security (bcrypt)
- **CORS**: Flask-CORS für Frontend-Integration

### Frontend
- **Framework**: Angular 17+ (Standalone Components)
- **Styling**: Custom CSS mit Arabic RTL Support
- **HTTP Client**: Angular HttpClient mit JWT Interceptors
- **Routing**: Angular Router mit Authentication Guards

### Datenbank Schema (Erweitert)

#### Admin Model - ERWEITERT
```python
class Admin(db.Model):
    __tablename__ = 'admins'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)  # NEU
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'admin' | 'restaurant_admin'
    is_active = db.Column(db.Boolean, default=True)
    status = db.Column(db.String(20), default='pending')  # pending/approved/rejected
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    restaurant_id = db.Column(db.Integer, nullable=True)
    
    def __init__(self, username, password, role='restaurant_admin', restaurant_id=None, status='pending'):
        self.username = username
        # NEU: Automatische E-Mail-Generierung
        if role == 'restaurant_admin':
            self.email = f"{username}@restaurant.com"
        else:
            self.email = f"{username}@admin.com"
        self.password_hash = generate_password_hash(password)
        self.role = role
        self.restaurant_id = restaurant_id
        self.status = status
```

---

## API Endpoints (Erweitert)

### Authentifizierung Endpoints - ERWEITERT

#### Unified Login (Verbessert)
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "restaurant_name@restaurant.com",  // Für Restaurant-Admins
  "password": "password123"
}

// ODER alternativ:
{
  "email": "restaurant_name",  // Wird automatisch zu restaurant_name@restaurant.com
  "password": "password123"
}

// ODER für Kunden:
{
  "email": "customer@email.com",
  "password": "password123"
}

Response (Restaurant-Admin):
{
  "message": "Admin login successful",
  "access_token": "jwt_token_here",
  "admin": {
    "id": 1,
    "username": "restaurant_name",
    "email": "restaurant_name@restaurant.com",
    "role": "restaurant_admin",
    "status": "approved",
    "restaurant_id": 1
  },
  "user_type": "admin",
  "login_email": "restaurant_name@restaurant.com"
}
```

### Restaurant Management Endpoints - ERWEITERT

#### Restaurant Registrierung (Verbessert)
```http
POST /api/restaurant/register
Content-Type: application/json

{
  "admin": {
    "username": "restaurant_name",
    "password": "secure_password"
  },
  "restaurant": {
    "name_ar": "اسم المطعم",
    "name_en": "Restaurant Name",
    "description_ar": "وصف المطعم",
    "description_en": "Restaurant Description",
    "category": "مشاوي",
    "address": "العنوان الكامل",
    "phone": "+963-XXX-XXX-XXX",
    "open_times": "9:00 AM - 11:00 PM"
  },
  "owner": {
    "name": "اسم المالك",
    "email": "owner@email.com",
    "phone": "+963-XXX-XXX-XXX"
  }
}

Response:
{
  "message": "Restaurant registration submitted successfully",
  "admin_id": 1,
  "restaurant_id": 1,
  "status": "pending",
  "username": "restaurant_name",
  "login_email": "restaurant_name@restaurant.com"  // NEU
}
```

### Admin Panel Endpoints - ERWEITERT

#### Restaurant Applications (Verbessert)
```http
GET /api/admin/restaurant-applications
Authorization: Bearer jwt_token (Super Admin)

Response:
{
  "applications": [
    {
      "id": 1,
      "username": "restaurant_name",
      "email": "restaurant_name@restaurant.com",  // NEU
      "status": "pending",
      "created_at": "2025-07-27T10:00:00Z",
      "is_active": false,
      "restaurant": {
        "name_ar": "مطعم الشام",
        "name_en": "Sham Restaurant",
        "category": "مشاوي",
        "address": "دمشق، سوريا",
        "phone": "+963-11-123-4567",
        "open_times": "9:00 ص - 11:00 م"
      },
      "owner": {
        "name": "صاحب المطعم",
        "email": "restaurant_name@restaurant.com",  // NEU: Korrekte E-Mail
        "phone": "+963 999 123 456"
      }
    }
  ],
  "total": 1
}
```

#### Restaurant Approval (Verbessert)
```http
POST /api/admin/restaurant-applications/{id}/approve
Authorization: Bearer jwt_token (Super Admin)

Response:
{
  "message": "Restaurant approved successfully",
  "admin_id": 1,
  "status": "approved",
  "username": "restaurant_name",
  "login_email": "restaurant_name@restaurant.com"  // NEU
}
```

---

## Authentifizierung System (Erweitert)

### Neues Login-System

#### 1. Automatische E-Mail-Erkennung
```python
# Login Logic (vereinfacht):
def login():
    email_or_username = request.json.get('email')
    
    # 1. Prüfe Customer-Login
    user = User.query.filter_by(email=email_or_username).first()
    if user: return customer_login(user)
    
    # 2. Prüfe Admin mit E-Mail
    admin = Admin.query.filter_by(email=email_or_username).first()
    if admin: return admin_login(admin)
    
    # 3. Prüfe Admin mit Username
    admin = Admin.query.filter_by(username=email_or_username).first()
    if admin: return admin_login(admin)
    
    # 4. Auto-Generierung: "restaurant_name" → "restaurant_name@restaurant.com"
    if '@' not in email_or_username:
        auto_email = f"{email_or_username}@restaurant.com"
        admin = Admin.query.filter_by(email=auto_email).first()
        if admin: return admin_login(admin)
```

#### 2. JWT Token Structure (Erweitert)
```json
{
  "sub": "admin_id",
  "role": "restaurant_admin",
  "restaurant_id": 1,
  "iat": 1722074400,
  "exp": 1722160800
}
```

### User Types und Permissions

1. **Customers (`user_type: "customer"`)**
   - Login mit: normale E-Mail Adresse
   - Permissions: Restaurants durchsuchen, bestellen, bewerten

2. **Restaurant Admins (`role: "restaurant_admin"`)**
   - Login mit: `restaurant_name@restaurant.com` ODER nur `restaurant_name`
   - Permissions: Eigenes Restaurant verwalten, Menü bearbeiten, Bestellungen verwalten

3. **Super Admins (`role: "admin"`)**
   - Login mit: `admin_username@admin.com`
   - Permissions: Restaurant-Anträge genehmigen, System verwalten

---

## Deployment Workflow (Erweitert)

### Datenbank Migration

#### Neue Datenbank erstellen
```bash
# Methode 1: Complete Reset (Daten gehen verloren)
cd backend/migrations
python correct_fix.py

# Methode 2: Tabellen über Flask
cd backend
python migrations/create_tables.py
```

#### Bestehende Datenbank erweitern
```bash
# E-Mail Spalte zu bestehender Datenbank hinzufügen
cd backend
python migration_add_email_to_admins.py
```

### Setup Guide

#### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt

# Datenbank erstellen (neu)
python migrations/correct_fix.py

# App starten
python app.py
```

#### 2. Frontend Setup
```bash
cd frontend/sahtein-simple
npm install
ng serve
```

#### 3. Super Admin erstellen
```python
# Python Console oder Script
from app import create_app
from app.models.admin import Admin
from app.database import db

app = create_app()
with app.app_context():
    admin = Admin('admin', 'admin123', 'admin', status='approved')
    admin.is_active = True
    db.session.add(admin)
    db.session.commit()
    print(f"Super Admin created: {admin.email}")
```

---

## Testing Workflow (Erweitert)

### 1. Restaurant Registration Test
```bash
# 1. Gehe zur Frontend App
# 2. Registriere Restaurant: "testrestaurant"
# 3. System erstellt automatisch: testrestaurant@restaurant.com
# 4. Status: pending
```

### 2. Admin Approval Test
```bash
# 1. Login als Super Admin: admin@admin.com
# 2. Gehe zu Admin Panel
# 3. Siehe Restaurant Application mit korrekter E-Mail
# 4. Genehmige Restaurant
# 5. Status: approved
```

### 3. Restaurant Login Test
```bash
# Alle diese Login-Varianten funktionieren:
# 1. testrestaurant@restaurant.com + password
# 2. testrestaurant + password (wird auto-erweitert)
# 3. Umleitung zu Restaurant Dashboard
```

---

## Neue Features Details

### 1. Automatische E-Mail-Generierung

**Funktion**: Beim Erstellen eines Restaurant-Admins wird automatisch eine E-Mail generiert.

**Logic**:
```python
# Im Admin.__init__()
if role == 'restaurant_admin':
    self.email = f"{username}@restaurant.com"
else:
    self.email = f"{username}@admin.com"
```

**Vorteile**:
- ✅ Einheitliche E-Mail-Struktur
- ✅ Keine manuellen E-Mail-Eingaben nötig
- ✅ Automatische Login-Erkennung
- ✅ Benutzerfreundlich für Restaurant-Besitzer

### 2. Verbessertes Admin Panel

**Neue Anzeige**:
- Username: `restaurant_name`
- E-Mail: `restaurant_name@restaurant.com`
- Login-Anweisung: "Nach der Genehmigung anmelden mit: restaurant_name@restaurant.com"

**API Response Änderungen**:
```json
{
  "username": "restaurant_name",
  "email": "restaurant_name@restaurant.com",  // NEU
  "owner": {
    "email": "restaurant_name@restaurant.com"  // NEU: Korrekte E-Mail
  }
}
```

### 3. Flexibles Login-System

**Unterstützte Login-Formate**:
1. `restaurant_name@restaurant.com` + password
2. `restaurant_name` + password (auto-erweitert)
3. `customer@email.com` + password
4. `admin@admin.com` + password

**Auto-Detection Logic**:
- Enthält `@` → Direkte E-Mail-Suche
- Enthält kein `@` → Username-Suche + Auto-Generierung

---

## Troubleshooting (Erweitert)

### 1. E-Mail Spalte fehlt
```bash
# Error: no such column: admins.email
# Lösung:
cd backend/migrations
python correct_fix.py
```

### 2. Login funktioniert nicht
```bash
# 1. Prüfe Admin-Daten
cd backend
python check_admin_emails.py

# 2. Prüfe ob Status = 'approved'
# 3. Prüfe ob is_active = True
```

### 3. Admin Panel zeigt falsche Daten
```bash
# Update restaurant_admin.py mit der erweiterten Version
# Restart Backend: python app.py
```

### 4. Datenbank Inkonsistenzen
```bash
# Complete Reset (ACHTUNG: Daten verloren)
cd backend/migrations
python correct_fix.py

# Dann App starten
cd ..
python app.py
```

---

## Zukünftige Erweiterungen

### Geplante Features

1. **E-Mail Benachrichtigungen**
   - Bestätigungs-E-Mails bei Registrierung
   - Genehmigungsbenachrichtigungen
   - Passwort-Reset via E-Mail

2. **Erweiterte Admin Features**
   - Bulk-Genehmigungen
   - Restaurant-Kategorien Management
   - Detailed Analytics Dashboard

3. **Restaurant Management**
   - Profilbild Upload
   - Öffnungszeiten Management
   - Delivery Zones Definition

4. **Mobile App Integration**
   - Push Notifications
   - Offline Order Caching
   - GPS Location Services

### Technische Verbesserungen

1. **Database Optimizations**
   - PostgreSQL Migration für Produktion
   - Database Indexing
   - Query Performance Monitoring

2. **Security Enhancements**
   - Rate Limiting
   - 2FA für Admin Accounts
   - API Security Headers

3. **DevOps Integration**
   - Docker Containerization
   - CI/CD Pipeline
   - Automated Testing

---

## Contributor Guidelines

### Code Standards
- **Python**: PEP 8 compliance
- **TypeScript**: Angular Style Guide
- **Database**: Descriptive naming conventions
- **API**: RESTful design patterns

### Testing Requirements
- Unit tests für Business Logic
- Integration tests für API Endpoints
- E2E tests für Critical User Flows
- Performance tests für Database Queries

### Documentation Updates
- API Changes müssen dokumentiert werden
- Database Schema Änderungen tracken
- Setup Instructions aktuell halten
- Troubleshooting Guide erweitern

---

## Changelog

### Version 2.1.0 (Juli 2025)
- ✅ **NEW**: Automatische E-Mail-Generierung für Restaurant-Admins
- ✅ **IMPROVED**: Unified Login System mit E-Mail Support
- ✅ **FIXED**: Admin Panel zeigt korrekte Login-Daten
- ✅ **ENHANCED**: Database Schema mit E-Mail Feld
- ✅ **ADDED**: Migration Scripts für bestehende Datenbanken

### Version 2.0.0 (Juli 2025)
- ✅ **NEW**: Restaurant Registration Workflow
- ✅ **NEW**: Admin Approval System
- ✅ **NEW**: JWT-based Authentication
- ✅ **NEW**: Multi-language Support (AR/EN)
- ✅ **NEW**: Order Management System

---

## Support & Contact

### Technischer Support
- **Repository**: GitHub Repository Link
- **Issues**: Bug Reports über GitHub Issues
- **Discussions**: Feature Requests über GitHub Discussions

### Entwickler Kontakt
- **Lead Developer**: [Your Name]
- **E-Mail**: [Your Email]
- **Project Manager**: [PM Name]

### Dokumentation
- **API Docs**: Swagger/OpenAPI Documentation
- **Setup Guide**: README.md im Repository
- **Deployment Guide**: docs/deployment.md

---

## Lizenz

MIT License - Siehe LICENSE Datei im Repository für Details.

---

*Letzte Aktualisierung: Juli 27, 2025*
*Version: 2.1.0*
*Status: Production Ready*