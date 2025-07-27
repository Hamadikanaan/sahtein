# migrations/create_tables.py - NUR Tabellen erstellen
from app import app
from app.database import db

def create_all_tables():
    """Erstellt alle Tabellen mit der neuen Struktur"""
    with app.app_context():
        try:
            print("🗑️ Lösche bestehende Tabellen...")
            db.drop_all()
            
            print("📝 Erstelle neue Tabellen...")
            db.create_all()
            
            print("✅ Alle Tabellen erstellt!")
            print("📋 Tabellen:")
            print("   - users (Kunden)")
            print("   - admins (Restaurant-Besitzer + Super-Admins) - MIT EMAIL FELD")
            print("   - restaurants")
            print("   - dishes")
            print("   - orders")
            print("   - order_items")
            print("   - reviews")
            
        except Exception as e:
            print(f"❌ Fehler: {e}")

def show_admin_structure():
    """Zeigt die neue Admin-Tabellen-Struktur"""
    print("\n📊 Admin-Tabelle Struktur:")
    print("   - id")
    print("   - username")
    print("   - email (NEU) - wird automatisch generiert")
    print("   - password_hash")
    print("   - role (admin/restaurant_admin)")
    print("   - status (pending/approved/rejected)")
    print("   - is_active")
    print("   - restaurant_id")
    print("   - created_at")
    print("   - last_login")

if __name__ == "__main__":
    print("🚀 Erstelle Sahtein-Datenbank...")
    create_all_tables()
    show_admin_structure()
    
    print("\n✅ Fertig! Du kannst jetzt:")
    print("   1. Restaurants registrieren")
    print("   2. Als Super-Admin genehmigen")
    print("   3. Mit automatischer E-Mail anmelden")
    print("   4. Beispiel: Restaurant 'far' → Login: far@restaurant.com")