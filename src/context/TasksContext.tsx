import { createContext, ReactNode, useState } from "react";

interface CreateTaskData {
  description: string;
  minutesAmount: number;
}
interface ITask {
  id: string;
  description: string;
  minuteAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

interface TaskContextType {
  tasks: ITask[];
  activeTask: ITask | undefined;
  activeTaskId: string | null;
  amountSecondsPassed: number;
  markCurrentTaskAsFinished: () => void;
  setSecondsPassed: (seconds: number) => void;
  createNewTask: (data: CreateTaskData) => void;
  interruptCurrentTask: () => void;
}

export const TasksContext = createContext({} as TaskContextType);

interface TasksContextProviderProps {
  children: ReactNode;
}

export function TaskContextProvider({ children }: TasksContextProviderProps) {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

  const activeTask = tasks.find((task) => task.id === activeTaskId);

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds);
  }

  function markCurrentTaskAsFinished() {
    setTasks((state) =>
      state.map((task) => {
        if (task.id === activeTaskId) {
          return { ...task, finishedDate: new Date() };
        } else {
          return task;
        }
      })
    );
  }

  function createNewTask(data: CreateTaskData) {
    const id = String(new Date().getTime());
    const newTask: ITask = {
      id,
      description: data.description,
      minuteAmount: data.minutesAmount,
      startDate: new Date(),
    };

    setTasks((state) => [...state, newTask]);

    setActiveTaskId(id);
    setAmountSecondsPassed(0);
    // reset();
  }

  function interruptCurrentTask() {
    setTasks((state) =>
      state.map((task) => {
        if (task.id === activeTaskId) {
          return { ...task, interruptedDate: new Date() };
        } else {
          return task;
        }
      })
    );
    setActiveTaskId(null);
  }

  return (
    <TasksContext.Provider
      value={{
        activeTask,
        tasks,
        activeTaskId,
        markCurrentTaskAsFinished,
        amountSecondsPassed,
        setSecondsPassed,
        createNewTask,
        interruptCurrentTask,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}
