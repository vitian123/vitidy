#!/usr/bin/env bash
echo "============================================================"
echo "          VITidy - Student & Hostel Cleaning Portal"
echo "                    Localhost Launcher"
echo "============================================================"
echo ""

if ! command -v node &> /dev/null; then
    echo "[!] Node.js was not detected on this system."
    echo "[*] Launching instant standalone browser edition instead..."
    if command -v open &> /dev/null; then
        open "VITidy_Preview.html"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "VITidy_Preview.html"
    fi
    exit 0
fi

if [ ! -d "node_modules" ]; then
    echo "[*] Installing dependencies with npm install..."
    npm install
fi

echo "[*] Starting Vite server on localhost..."
npm run dev
