# ContactVault — WhatsApp Contact Saver

A full-stack app to collect WhatsApp contacts and export them as VCF files.

---

## Tech Stack
- **Frontend**: React + React Router
- **Backend**: Flask (Python) + SQLite
- **Styling**: Custom CSS (Syne + DM Sans fonts)

---

## Setup & Run

### 1. Backend (Flask)
```bash
cd backend
pip install -r requirements.txt
python app.py
```
Server runs on http://localhost:5000

### 2. Frontend (React)
```bash
cd frontend
npm install
npm start
```
App opens on http://localhost:3000

---

## Pages

| Route    | Description                        |
|----------|------------------------------------|
| `/`      | Landing page                       |
| `/save`  | Public contact submission form     |
| `/admin` | Password-protected admin dashboard |

---

## Admin Panel (default password: `admin1234`)

Change the password in `backend/app.py`:
```python
ADMIN_PASSWORD = "your_secure_password_here"
```

### Admin features:
- **View all contacts** in a table with name, number, date added
- **Generate VCF files** — downloads a ZIP with individual `.vcf` files named:
  - `John Doe vcf1.vcf`
  - `Jane Smith vcf2.vcf`
  - etc.
- **Reset database** — permanently deletes all contacts

---

## Deployment

### Quick (same server):
Run Flask on port 5000 and build React:
```bash
cd frontend && npm run build
```
Then serve the `build/` folder via Flask or Nginx.

### Production recommendation:
- Deploy Flask on **Railway**, **Render**, or **VPS**
- Deploy React on **Vercel** or **Netlify**
- Update the `proxy` in `frontend/package.json` to your Flask URL
"# vcf" 
