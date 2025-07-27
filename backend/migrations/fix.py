# migrations/correct_fix.py - Mit korrektem Pfad zur Datenbank
import os
import sqlite3

def fix_database_correct():
    """Lösche Datenbank-Datei und erstelle neue Struktur"""
    
    # Korrekter Pfad: migrations -> backend -> sahtein -> database
    db_path = os.path.join('..', '..', 'database', 'sahtein.db')
    
    print(f"🔧 Repariere Datenbank: {os.path.abspath(db_path)}")
    
    try:
        # 1. Datenbank-Datei löschen (falls vorhanden)
        if os.path.exists(db_path):
            os.remove(db_path)
            print("🗑️ Alte Datenbank gelöscht")
        else:
            print("📝 Keine alte Datenbank gefunden")
        
        # 2. Stelle sicher, dass der Ordner existiert
        db_dir = os.path.dirname(db_path)
        if not os.path.exists(db_dir):
            os.makedirs(db_dir)
            print(f"📁 Erstellt Ordner: {db_dir}")
        
        # 3. Erstelle neue leere Datenbank mit korrekter Struktur
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        print("📝 Erstelle neue Tabellen...")
        
        # Users Tabelle
        cursor.execute('''
            CREATE TABLE users (
                id INTEGER PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(120) UNIQUE NOT NULL,
                phone VARCHAR(20) NOT NULL,
                address TEXT NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                is_active BOOLEAN DEFAULT 1
            )
        ''')
        
        # Admins Tabelle - MIT EMAIL FELD
        cursor.execute('''
            CREATE TABLE admins (
                id INTEGER PRIMARY KEY,
                username VARCHAR(80) UNIQUE NOT NULL,
                email VARCHAR(120) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role VARCHAR(20) NOT NULL,
                is_active BOOLEAN DEFAULT 1,
                status VARCHAR(20) DEFAULT 'pending',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                last_login DATETIME,
                restaurant_id INTEGER
            )
        ''')
        
        # Restaurants Tabelle
        cursor.execute('''
            CREATE TABLE restaurants (
                id INTEGER PRIMARY KEY,
                name_ar VARCHAR(100) NOT NULL,
                name_en VARCHAR(100) NOT NULL,
                description_ar TEXT,
                description_en TEXT,
                category VARCHAR(50) NOT NULL,
                address TEXT NOT NULL,
                phone VARCHAR(20) NOT NULL,
                open_times VARCHAR(100) NOT NULL,
                photo_url VARCHAR(255),
                rating FLOAT DEFAULT 0.0,
                is_active BOOLEAN DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                admin_id INTEGER,
                FOREIGN KEY (admin_id) REFERENCES admins (id)
            )
        ''')
        
        # Dishes Tabelle
        cursor.execute('''
            CREATE TABLE dishes (
                id INTEGER PRIMARY KEY,
                restaurant_id INTEGER NOT NULL,
                name_ar VARCHAR(100) NOT NULL,
                name_en VARCHAR(100) NOT NULL,
                description_ar TEXT,
                description_en TEXT,
                price FLOAT NOT NULL,
                ingredients_ar TEXT,
                ingredients_en TEXT,
                photo_url VARCHAR(255),
                is_available BOOLEAN DEFAULT 1,
                category VARCHAR(50) DEFAULT 'أطباق رئيسية',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
            )
        ''')
        
        # Orders Tabelle
        cursor.execute('''
            CREATE TABLE orders (
                id INTEGER PRIMARY KEY,
                user_id INTEGER NOT NULL,
                restaurant_id INTEGER NOT NULL,
                status VARCHAR(50) DEFAULT 'pending',
                total_price FLOAT NOT NULL,
                delivery_address TEXT NOT NULL,
                phone VARCHAR(20) NOT NULL,
                notes TEXT,
                payment_method VARCHAR(20) DEFAULT 'cash',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id),
                FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
            )
        ''')
        
        # Order Items Tabelle
        cursor.execute('''
            CREATE TABLE order_items (
                id INTEGER PRIMARY KEY,
                order_id INTEGER NOT NULL,
                dish_id INTEGER NOT NULL,
                quantity INTEGER NOT NULL DEFAULT 1,
                price FLOAT NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders (id),
                FOREIGN KEY (dish_id) REFERENCES dishes (id)
            )
        ''')
        
        # Reviews Tabelle
        cursor.execute('''
            CREATE TABLE reviews (
                id INTEGER PRIMARY KEY,
                user_id INTEGER NOT NULL,
                restaurant_id INTEGER NOT NULL,
                order_id INTEGER,
                rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
                comment TEXT,
                is_approved BOOLEAN DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id),
                FOREIGN KEY (restaurant_id) REFERENCES restaurants (id),
                FOREIGN KEY (order_id) REFERENCES orders (id),
                UNIQUE(user_id, order_id)
            )
        ''')
        
        conn.commit()
        conn.close()
        
        print("✅ Datenbank erfolgreich erstellt!")
        print("📋 Tabellen erstellt:")
        print("   - users")
        print("   - admins (MIT email Spalte)")
        print("   - restaurants")
        print("   - dishes")
        print("   - orders")
        print("   - order_items")
        print("   - reviews")
        
        print("\n🚀 Du kannst jetzt die App starten:")
        print("   cd ..")
        print("   python app.py")
        
        return True
        
    except Exception as e:
        print(f"❌ Fehler: {e}")
        return False

if __name__ == "__main__":
    success = fix_database_correct()
    if success:
        print("\n✅ Problem gelöst!")
        print("Die Datenbank hat jetzt die korrekte Struktur mit email Feld.")
    else:
        print("\n❌ Problem nicht gelöst. Prüfe die Fehler oben.")