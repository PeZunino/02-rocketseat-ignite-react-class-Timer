import { HandPalm, Play } from "phosphor-react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import * as zod from "zod"; // nao tem export default
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from "./styles";
import { createContext, useState } from "react";
import { NewTaskForm } from "./components/NewTaskForm";
import { Countdown } from "./components/Countdown";

interface ITask {
  id: string;
  description: string;
  minuteAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

interface TaskContextType {
  activeTask: ITask | undefined;
  activeTaskId: string | null;
  amountSecondsPassed: number;
  markCurrentTaskAsFinished: () => void;
  setSecondsPassed: (seconds: number) => void;
}
export const TasksContext = createContext({} as TaskContextType);
const newTaskFormValidationSchema = zod.object({
  description: zod.string().min(1, "Informe a tarefa"),
  minutesAmount: zod.number().min(1).max(60),
});

type NewTaskFormData = zod.infer<typeof newTaskFormValidationSchema>;

export function Home() {
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

  function handleCreateNewTask(data: NewTaskFormData) {
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
    reset();
  }

  function handleInterruptCycle() {
    setTasks((state) =>
      state.map((task) => {
        if (task.id === activeTaskId) {
          return { ...task, interrruptedDate: new Date() };
        } else {
          return task;
        }
      })
    );
    setActiveTaskId(null);
  }
  const newTaskForm = useForm<NewTaskFormData>({
    resolver: zodResolver(newTaskFormValidationSchema),
    defaultValues: {
      description: "",
      minutesAmount: 0,
    },
  });
  const { handleSubmit, watch, reset } = newTaskForm;
  const description = watch("description"); //transforma em controlled (recriado toda vez que há mudança)
  const isSubmitDisabled = !description;
  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewTask)}>
        <TasksContext.Provider
          value={{
            activeTask,
            activeTaskId,
            markCurrentTaskAsFinished,
            amountSecondsPassed,
            setSecondsPassed,
          }}
        >
          <FormProvider {...newTaskForm}>
            <NewTaskForm />
          </FormProvider>

          <Countdown />
        </TasksContext.Provider>

        {activeTask ? (
          <StopCountdownButton onClick={handleInterruptCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  );
}
