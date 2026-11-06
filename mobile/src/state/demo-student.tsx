import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import {
  insertTask,
  listTasks,
  toggleStoredTask,
  type StudentTask,
} from '@/lib/student-db';

export type { StudentTask } from '@/lib/student-db';

type DemoStudentContextValue = {
  tasks: StudentTask[];
  ready: boolean;
  storageError: string | null;
  toggleTask: (id: string) => void;
  addTask: (title: string) => void;
};

const DemoStudentContext =
  createContext<DemoStudentContextValue | null>(null);

export function DemoStudentProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [tasks, setTasks] = useState<StudentTask[]>([]);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);

  const writeQueue = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    let active = true;

    listTasks()
      .then((savedTasks) => {
        if (!active) return;
        setTasks(savedTasks);
        setReady(true);
        setStorageError(null);
      })
      .catch(() => {
        if (!active) return;
        setStorageError('Unable to load saved tasks.');
      });

    return () => {
      active = false;
    };
  }, []);

  const enqueueWrite = useCallback(
    (operation: () => Promise<void>) => {
      writeQueue.current = writeQueue.current.then(async () => {
        try {
          await operation();
          const updatedTasks = await listTasks();

          setTasks(updatedTasks);
          setStorageError(null);
        } catch {
          setStorageError(
            'Could not save your changes. Please try again.'
          );
        }
      });
    },
    []
  );

  const addTask = useCallback(
    (title: string) => {
      const trimmed = title.trim();

      if (!ready || !trimmed) return;

      const task: StudentTask = {
        id: `task-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        title: trimmed.slice(0, 100),
        subject: 'Personal',
        due: 'Not scheduled',
        done: false,
        important: false,
      };

      enqueueWrite(() => insertTask(task));
    },
    [ready, enqueueWrite]
  );

  const toggleTask = useCallback(
    (id: string) => {
      if (!ready) return;
      enqueueWrite(() => toggleStoredTask(id));
    },
    [ready, enqueueWrite]
  );

  const value = useMemo(
    () => ({
      tasks,
      ready,
      storageError,
      toggleTask,
      addTask,
    }),
    [tasks, ready, storageError, toggleTask, addTask]
  );

  return (
    <DemoStudentContext.Provider value={value}>
      {children}
    </DemoStudentContext.Provider>
  );
}

export function useDemoStudent() {
  const context = useContext(DemoStudentContext);

  if (!context) {
    throw new Error(
      'useDemoStudent must be used within DemoStudentProvider'
    );
  }

  return context;
}
