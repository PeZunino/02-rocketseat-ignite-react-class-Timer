import {
  createContext,
  ReactNode,
  useEffect,
  useReducer,
  useState,
} from "react";
import { ITask, tasksReducer } from "../reducers/tasks/reducer";
import {
  addNewTaskAction,
  interruptCurrentTaskAction,
  markCurrentTaskAsFinishedAction,
} from "../reducers/tasks/actions";
import { differenceInSeconds } from "date-fns";

interface CreateTaskData {
  description: string;
  minutesAmount: number;
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
  const [tasksState, dispatch] = useReducer(
    tasksReducer,
    {
      tasks: [],
      activeTaskId: null,
    },
    (initialState) => {
      const storedStateAsJSON = localStorage.getItem("@time:task-state-1.0.0");
      if (storedStateAsJSON) {
        return JSON.parse(storedStateAsJSON);
      }
      return initialState;
    }
  );

  const { tasks, activeTaskId } = tasksState;
  const activeTask = tasks.find((task) => task.id === activeTaskId);

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeTask) {
      return differenceInSeconds(new Date(), new Date(activeTask.startDate));
    }

    return 0;
  });

  useEffect(() => {
    const stateJSON = JSON.stringify(tasksState);
    localStorage.setItem("@time:task-state-1.0.0", stateJSON);
  }, [tasksState]);

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds);
  }

  function markCurrentTaskAsFinished() {
    dispatch(markCurrentTaskAsFinishedAction());
  }

  function createNewTask(data: CreateTaskData) {
    const id = String(new Date().getTime());
    const newTask: ITask = {
      id,
      description: data.description,
      minuteAmount: data.minutesAmount,
      startDate: new Date(),
    };

    dispatch(addNewTaskAction(newTask));

    setAmountSecondsPassed(0);
  }

  function interruptCurrentTask() {
    dispatch(interruptCurrentTaskAction());
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
