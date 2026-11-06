import * as SQLite from 'expo-sqlite';

export type StudentTask = {
  id: string;
  title: string;
  subject: string;
  due: string;
  done: boolean;
  important: boolean;
};

type TaskRow = {
  id: string;
  title: string;
  subject: string;
  due: string;
  completed: number;
  important: number;
};

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!databasePromise) {
    databasePromise = (async () => {
      const db = await SQLite.openDatabaseAsync('exampilot.db');

      await db.execAsync(`
        PRAGMA journal_mode = WAL;

        CREATE TABLE IF NOT EXISTS tasks (
          id TEXT PRIMARY KEY NOT NULL,
          title TEXT NOT NULL,
          subject TEXT NOT NULL,
          due TEXT NOT NULL,
          completed INTEGER NOT NULL DEFAULT 0,
          important INTEGER NOT NULL DEFAULT 0,
          created_at INTEGER NOT NULL
        );
      `);

      return db;
    })().catch((error) => {
      databasePromise = null;
      throw error;
    });
  }

  return databasePromise;
}

export async function listTasks(): Promise<StudentTask[]> {
  const db = await getDatabase();

  const rows = await db.getAllAsync<TaskRow>(
    `SELECT id, title, subject, due, completed, important
     FROM tasks
     ORDER BY created_at DESC, id DESC`
  );

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    subject: row.subject,
    due: row.due,
    done: row.completed === 1,
    important: row.important === 1,
  }));
}

export async function insertTask(task: StudentTask): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    `INSERT INTO tasks
     (id, title, subject, due, completed, important, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    task.id,
    task.title,
    task.subject,
    task.due,
    task.done ? 1 : 0,
    task.important ? 1 : 0,
    Date.now()
  );
}

export async function toggleStoredTask(id: string): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    `UPDATE tasks
     SET completed = CASE WHEN completed = 1 THEN 0 ELSE 1 END
     WHERE id = ?`,
    id
  );
}
