import { ITask } from "./reducer";

export enum ActionTypes {
  ADD_NEW_TASK = "ADD_NEW_TASK",
  INTERRUPT_CURRENT_TASK = "INTERRUPT_CURRENT_TASK",
  MARK_CURRENT_TASK_AS_FINISHED = "MARK_CURRENT_TASK_AS_FINISHED",
}

export type ActionTypesProps =
  | { type: ActionTypes.ADD_NEW_TASK; payload: { newTask: ITask } }
  | { type: ActionTypes.MARK_CURRENT_TASK_AS_FINISHED }
  | { type: ActionTypes.INTERRUPT_CURRENT_TASK };

export function addNewTaskAction(newTask: ITask): ActionTypesProps {
  return {
    type: ActionTypes.ADD_NEW_TASK,
    payload: {
      newTask,
    },
  };
}

export function markCurrentTaskAsFinishedAction(): ActionTypesProps {
  return {
    type: ActionTypes.MARK_CURRENT_TASK_AS_FINISHED,
  };
}

export function interruptCurrentTaskAction(): ActionTypesProps {
  return {
    type: ActionTypes.INTERRUPT_CURRENT_TASK,
  };
}
