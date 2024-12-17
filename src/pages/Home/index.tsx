import { HandPalm, Play } from "phosphor-react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import * as zod from "zod"; // nao tem export default
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from "./styles";
import { NewTaskForm } from "./components/NewTaskForm";
import { Countdown } from "./components/Countdown";
import { useContext } from "react";
import { TasksContext } from "../../context/TasksContext";

const newTaskFormValidationSchema = zod.object({
  description: zod.string().min(1, "Informe a tarefa"),
  minutesAmount: zod.number().min(1).max(60),
});

type NewTaskFormData = zod.infer<typeof newTaskFormValidationSchema>;

export function Home() {
  const { activeTask, createNewTask, interruptCurrentTask } =
    useContext(TasksContext);
  const newTaskForm = useForm<NewTaskFormData>({
    resolver: zodResolver(newTaskFormValidationSchema),
    defaultValues: {
      description: "",
      minutesAmount: 0,
    },
  });
  const { handleSubmit, watch, reset } = newTaskForm;

  function handleCreateNewTask(data: NewTaskFormData) {
    createNewTask(data);
    reset();
  }

  const description = watch("description"); //transforma em controlled (recriado toda vez que há mudança)
  const isSubmitDisabled = !description;
  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewTask)}>
        <FormProvider {...newTaskForm}>
          <NewTaskForm />
        </FormProvider>

        <Countdown />

        {activeTask ? (
          <StopCountdownButton onClick={interruptCurrentTask} type="button">
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
