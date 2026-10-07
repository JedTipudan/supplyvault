# SupplyVault 📦

**ITMSD 1 — Laboratory Exercise 05: Offline-First Persistence & CRUD with Expo SQLite**

> Davao Oriental State University — Faculty of Computing, Engineering, and Technology  
> Department of Information Technology | AY 2026-2027 | 1st Semester

---

## 📱 About

SupplyVault is an offline-first mobile inventory management app built with **React Native + Expo**. It uses an embedded **SQLite relational database** (`expo-sqlite`) to store, search, and manage inventory items — no internet connection required for data operations.

---

## 🗄️ Database Implementation

### Database Service — `src/database/client.ts`

- Opens SQLite database using `expo-sqlite`
- Enables `WAL` journal mode for performance: `PRAGMA journal_mode = WAL`
- Creates the `items` table with structured columns on first launch
- Auto-seeds 3 demo inventory records if the database is empty

### Table Schema — `src/database/schema.ts`

```sql
CREATE TABLE IF NOT EXISTS items (
  id        TEXT PRIMARY KEY NOT NULL,
  name      TEXT NOT NULL,
  sku       TEXT NOT NULL UNIQUE,
  category  TEXT NOT NULL,
  quantity  INTEGER NOT NULL DEFAULT 0,
  minimum_stock INTEGER NOT NULL DEFAULT 0,
  location  TEXT NOT NULL DEFAULT 'Unassigned',
  price     REAL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT
);
```

### CRUD Operations — `src/services/inventory.ts`

- **Create** — `INSERT INTO items` via `createItem()`
- **Read** — `SELECT * FROM items WHERE deleted_at IS NULL` via `listItems()`
- **Update** — `UPDATE items SET quantity=?` via `adjustQuantity()`
- **Delete** — soft delete via `UPDATE items SET deleted_at=?` in `softDeleteItem()`

### SQL Search — parameterized `LIKE ?`

```sql
SELECT * FROM items
WHERE deleted_at IS NULL
AND (name LIKE ? OR sku LIKE ? OR category LIKE ? OR location LIKE ?)
ORDER BY name ASC
```

---

## ✅ Lab 05 Requirements Checklist

- [x] Install `expo-sqlite` and initialize local SQLite database
- [x] `PRAGMA journal_mode = WAL` for performance
- [x] Create table schema with structured columns
- [x] Auto-seed sample inventory records on first launch
- [x] Render records dynamically into `<FlatList>` using SQL SELECT
- [x] Real-time search with parameterized SQL `LIKE ?` clauses
- [x] Create — Add Item form persisted to SQLite
- [x] Delete — Remove item with confirmation dialog
- [x] Update — stock quantity `+` / `-` buttons
- [x] Offline durability — data survives full app kill in Airplane Mode

---

## 🚀 Getting Started

### Prerequisites

- Node.js
- Expo Go app on your Android phone

### Installation

```bash
git clone https://github.com/JedTipudan/supplyvault.git
cd supplyvault
npm install
npx expo start --clear
```

Scan the QR code with **Expo Go** on your phone.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React Native + Expo | Mobile framework |
| expo-sqlite | Embedded local SQLite database |
| expo-router | File-based navigation |
| TypeScript | Type safety |
| Zustand | State management |
| Lucide Icons | UI icons |

---

## 👨‍💻 Developer

**Jed Tipudan**  
BS Information Technology  
Davao Oriental State University
