# SupplyVault 📦

An offline-first mobile inventory management app built with **React Native + Expo**. Uses an embedded **SQLite relational database** to store, search, and manage inventory items — no internet connection required.

---

## Features

- Inventory management — add, edit, delete, and view items
- Real-time SQL search — parameterized `LIKE ?` queries across name, SKU, category, and location
- Stock status tracking — In Stock, Low Stock, Out of Stock badges
- Barcode & QR code scanner
- Quantity adjustment with `+` / `-` buttons
- Soft delete with full audit trail
- Sync queue — changes queued locally and synced when online
- Activity log — every create, edit, and delete is recorded
- Dark mode support

---

## Database

Built with `expo-sqlite`. The database file `stockwise.db` is stored on the device and persists across app restarts.

```sql
PRAGMA journal_mode = WAL;

CREATE TABLE IF NOT EXISTS items (
  id            TEXT PRIMARY KEY NOT NULL,
  name          TEXT NOT NULL,
  sku           TEXT NOT NULL UNIQUE,
  category      TEXT NOT NULL,
  quantity      INTEGER NOT NULL DEFAULT 0,
  minimum_stock INTEGER NOT NULL DEFAULT 0,
  location      TEXT NOT NULL DEFAULT 'Unassigned',
  price         REAL,
  created_at    TEXT NOT NULL,
  updated_at    TEXT NOT NULL,
  deleted_at    TEXT
);
```

Auto-seeds 3 demo items on first launch so the app is never blank.

---

## Getting Started

### Prerequisites

- Node.js
- Expo Go on your Android phone

### Install

```bash
git clone https://github.com/JedTipudan/supplyvault.git
cd supplyvault
npm install
npx expo start --clear
```

Scan the QR code with Expo Go.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React Native + Expo | Mobile framework |
| expo-sqlite | Embedded local database |
| expo-router | File-based navigation |
| TypeScript | Type safety |
| Zustand | State management |
| Lucide Icons | UI icons |

---

## Developer

**Jed Tipudan**
