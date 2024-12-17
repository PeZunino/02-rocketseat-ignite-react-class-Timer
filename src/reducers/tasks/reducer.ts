import { produce } from "immer";
import { ActionTypes, ActionTypesProps } from "./actions";

export interface ITask {
  id: string;
  description: string;
  minuteAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

interface TaskState {
  tasks: ITask[];
  activeTaskId: string | null;
}

export function tasksReducer(state: TaskState, action: ActionTypesProps) {
  switch (action.type) {
    case ActionTypes.ADD_NEW_TASK:
      return produce(state, (draft) => {
        draft.tasks.push(action.payload.newTask);
        draft.activeTaskId = action.payload.newTask.id;
      });

    case ActionTypes.INTERRUPT_CURRENT_TASK: {
      const currentActiveTaskIndex = state.tasks.findIndex(
        (task) => task.id === state.activeTaskId
      );
      return produce(state, (draft) => {
        if (currentActiveTaskIndex < 0) {
          return state;
        } else {
          draft.tasks[currentActiveTaskIndex].interruptedDate = new Date();
        }
        draft.activeTaskId = null;
      });
    }

    case ActionTypes.MARK_CURRENT_TASK_AS_FINISHED: {
      const currentActiveTaskIndex = state.tasks.findIndex(
        (task) => task.id === state.activeTaskId
      );

      return produce(state, (draft) => {
        if (currentActiveTaskIndex < 0) {
          return state;
        } else {
          draft.tasks[currentActiveTaskIndex].finishedDate = new Date();
        }
        draft.activeTaskId = null;
      });
    }

    default:
      return state;
  }
}
