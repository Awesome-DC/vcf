from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import sqlite3, os, io, re
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
CORS(app, origins=[FRONTEND_URL])

DB_PATH = os.path.join(os.path.dirname(__file__), os.getenv("DB_PATH", "contacts.db"))
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin1234")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS contacts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                phone TEXT NOT NULL,
                country_code TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
        """)
        conn.commit()

init_db()

@app.route("/api/submit", methods=["POST"])
def submit():
    data = request.json
    name = data.get("name","").strip()
    phone = data.get("phone","").strip()
    country_code = data.get("country_code","").strip()
    if not name or not phone or not country_code:
        return jsonify({"error": "All fields required"}), 400
    phone_clean = re.sub(r"\D","", phone)
    full_phone = country_code + phone_clean.lstrip("0")
    with get_db() as conn:
        conn.execute(
            "INSERT INTO contacts (name, phone, country_code, created_at) VALUES (?,?,?,?)",
            (name, full_phone, country_code, datetime.utcnow().isoformat())
        )
        conn.commit()
    return jsonify({"message": "Contact saved successfully"}), 201

@app.route("/api/admin/login", methods=["POST"])
def admin_login():
    data = request.json
    if data.get("password") == ADMIN_PASSWORD:
        return jsonify({"success": True})
    return jsonify({"error": "Invalid password"}), 401

@app.route("/api/admin/contacts", methods=["GET"])
def get_contacts():
    pw = request.headers.get("X-Admin-Password","")
    if pw != ADMIN_PASSWORD:
        return jsonify({"error": "Unauthorized"}), 401
    with get_db() as conn:
        rows = conn.execute("SELECT * FROM contacts ORDER BY id ASC").fetchall()
    return jsonify([dict(r) for r in rows])

@app.route("/api/admin/generate-vcf", methods=["GET"])
def generate_vcf():
    pw = request.headers.get("X-Admin-Password","")
    if pw != ADMIN_PASSWORD:
        return jsonify({"error": "Unauthorized"}), 401
    with get_db() as conn:
        rows = conn.execute("SELECT * FROM contacts ORDER BY id ASC").fetchall()
    if not rows:
        return jsonify({"error": "No contacts"}), 404

    vcf_entries = []
    for i, row in enumerate(rows, start=1):
        name = row["name"]
        phone = row["phone"]
        parts = name.strip().split()
        last = parts[0] if parts else name
        first = " ".join(parts[1:]) if len(parts) > 1 else ""
        display_name = f"{name} vcf{i}"
        vcf_entries.append(
            f"BEGIN:VCARD\n"
            f"VERSION:3.0\n"
            f"FN:{display_name}\n"
            f"N:{last};{first};;;\n"
            f"TEL;TYPE=WHATSAPP,CELL:{phone}\n"
            f"END:VCARD"
        )

    vcf_content = "\n\n".join(vcf_entries)
    buffer = io.BytesIO(vcf_content.encode("utf-8"))
    buffer.seek(0)
    return send_file(
        buffer,
        mimetype="text/vcard",
        as_attachment=True,
        download_name="contacts.vcf"
    )

@app.route("/api/admin/reset", methods=["DELETE"])
def reset_db():
    pw = request.headers.get("X-Admin-Password","")
    if pw != ADMIN_PASSWORD:
        return jsonify({"error": "Unauthorized"}), 401
    with get_db() as conn:
        conn.execute("DELETE FROM contacts")
        conn.execute("DELETE FROM sqlite_sequence WHERE name='contacts'")
        conn.commit()
    return jsonify({"message": "Database reset"})

if __name__ == "__main__":
    debug = os.getenv("FLASK_DEBUG", "True") == "True"
    app.run(debug=debug, port=5000)
