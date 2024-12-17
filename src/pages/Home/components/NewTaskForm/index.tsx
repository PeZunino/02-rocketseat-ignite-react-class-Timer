import { FormContainer, MinutesAmountInput, TaskInput } from "./styles";

import { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { TasksContext } from "../../../../context/TasksContext";

export function NewTaskForm() {
  const { activeTask } = useContext(TasksContext);

  const { register } = useFormContext();
  return (
    <FormContainer>
      <label htmlFor="description">Vou trabalhar em</label>
      <TaskInput
        id="description"
        placeholder="Dê um nome para o seu projeto"
        list="description-suggestions"
        disabled={!!activeTask}
        {...register("description")}
      />

      <datalist id="description-suggestions">
        <option value="Projeto 1" />
        <option value="Projeto 2" />
        <option value="Projeto 3" />
        <option value="Projeto 4" />
      </datalist>
      <label htmlFor="minutesAmount">durante</label>
      <MinutesAmountInput
        type="number"
        id="minutesAmount"
        placeholder="00"
        step={5}
        min={5}
        max={60}
        disabled={!!activeTask}
        {...register("minutesAmount", { valueAsNumber: true })}
      />
      <span>minutos.</span>
    </FormContainer>
  );
}
