# SupplyVault 📦

**ITMSD 1 - Laboratory Exercise 05: Offline-First Persistence & CRUD with Expo SQLite**

> Davao Oriental State University — Faculty of Computing, Engineering, and Technology  
> Department of Information Technology | AY 2026-2027 | 1st Semester

---

## 📱 About

SupplyVault is a fully offline-first mobile inventory management app built with **React Native + Expo**. It uses an embedded **SQLite relational database** to store, search, and manage inventory items — no internet connection required.

---

## ✅ Features

- 📦 **Inventory Management** — Add, edit, delete, and view items
- 🔍 **Real-time SQL Search** — Parameterized `LIKE ?` queries on the local database
- 📊 **Stock Status** — In Stock, Low Stock, Out of Stock tracking
- 📷 **Barcode & QR Scanner** — Scan items using the device camera
- 🤖 **AI Item Recognition** — Identify items from photos
- 🔄 **Offline-First Sync** — All changes saved locally, synced when online
- 🌙 **Dark Mode** — Full light/dark theme support
- 📈 **Reports & Export** — CSV and JSON export of inventory data
- 🔔 **Notifications** — Low stock and out-of-stock alerts

---

## 🗄️ Database (SQLite)

- Initialized with `expo-sqlite` using `WAL` journal mode for performance
- Auto-seeds demo inventory on first launch
- Full CRUD operations with parameterized queries (SQL injection safe)
- Data persists across app restarts and Airplane Mode

---

## 🚀 Getting Started

### Prerequisites
- Node.js
- Expo Go app on your phone

### Installation

```bash
git clone https://github.com/JedTipudan/supplyvault.git
cd supplyvault
npm install
npx expo start --clear
```

Scan the QR code with **Expo Go** on your phone.

---

## 🧪 Lab 05 Requirements Checklist

- [x] Install `expo-sqlite` and initialize local SQLite database
- [x] Create table schema with structured columns
- [x] Auto-seed sample inventory records on first launch
- [x] Render records dynamically into `<FlatList>` using SQL SELECT
- [x] Real-time search with parameterized SQL `LIKE ?` clauses
- [x] Create (Add Item) operation persisted to SQLite
- [x] Delete (Remove Item) with confirmation dialog
- [x] Update stock quantity (`+` / `-` buttons)
- [x] Offline durability — data survives full app kill in Airplane Mode

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React Native + Expo | Mobile framework |
| expo-sqlite | Embedded local database |
| expo-router | File-based navigation |
| expo-camera | Barcode & QR scanning |
| Zustand | State management |
| TypeScript | Type safety |
| Lucide Icons | UI icons |

---

## 👨‍💻 Developer

**Jed Tipudan**  
BS Information Technology  
Davao Oriental State University
