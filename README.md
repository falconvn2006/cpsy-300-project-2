# CPSY-300 Project Part 2

## Testing Setup (For Now)

### Run Backend:

1. Open Terminal
2. `cd backend`
3. `python -m venv .venv`
4. `source .venv/bin/activate`
5. `pip install -r requirements.txt`
6. `python server.py`
7. Copy Server Address

### Run Frontend:

8. Go to `frontend/.env.local`
9. Paste `NEXT_PUBLIC_BACKEND_URL=[Server Address]`
10. Open New Terminal
11. `cd frontend`
12. `npm install`
13. `npm run build` 
14. `npm run dev`