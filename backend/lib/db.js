import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

export function openDb(dataDir) {
  let file = ':memory:';
  if (dataDir !== ':memory:') {
    mkdirSync(dataDir, { recursive: true });
    file = path.join(dataDir, 'ryvqena.db');
  }
  const db = new DatabaseSync(file);
  db.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS inquiries (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at   TEXT    NOT NULL,
      name         TEXT    NOT NULL,
      email        TEXT    NOT NULL,
      organisation TEXT    NOT NULL DEFAULT '',
      service      TEXT    NOT NULL,
      message      TEXT    NOT NULL,
      status       TEXT    NOT NULL DEFAULT 'new',
      ip_hash      TEXT,
      notified     INTEGER NOT NULL DEFAULT 0
    );
    CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status, created_at);
  `);

  const insert = db.prepare(
    'INSERT INTO inquiries (created_at, name, email, organisation, service, message, ip_hash) VALUES (?, ?, ?, ?, ?, ?, ?)',
  );
  const byId = db.prepare('SELECT * FROM inquiries WHERE id = ?');
  const setStatus = db.prepare('UPDATE inquiries SET status = ? WHERE id = ?');
  const setNotified = db.prepare('UPDATE inquiries SET notified = 1 WHERE id = ?');
  const listAll = db.prepare('SELECT * FROM inquiries ORDER BY id DESC LIMIT ? OFFSET ?');
  const listBy = db.prepare('SELECT * FROM inquiries WHERE status = ? ORDER BY id DESC LIMIT ? OFFSET ?');
  const countAll = db.prepare('SELECT COUNT(*) AS n FROM inquiries');
  const countBy = db.prepare('SELECT COUNT(*) AS n FROM inquiries WHERE status = ?');

  return {
    raw: db,
    create(v, ipHash) {
      const r = insert.run(new Date().toISOString(), v.name, v.email, v.organisation, v.service, v.message, ipHash);
      return Number(r.lastInsertRowid);
    },
    get: (id) => byId.get(id),
    setStatus: (id, s) => setStatus.run(s, id).changes > 0,
    markNotified: (id) => setNotified.run(id),
    list({ status, limit, offset }) {
      const items = status ? listBy.all(status, limit, offset) : listAll.all(limit, offset);
      const total = (status ? countBy.get(status) : countAll.get()).n;
      return { items, total };
    },
    close: () => db.close(),
  };
}
