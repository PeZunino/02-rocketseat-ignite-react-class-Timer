import { useContext, useEffect } from "react";
import { differenceInSeconds } from "date-fns";
import { CountdownContainer, Separator } from "./styles";
import { TasksContext } from "../../../../context/TasksContext";

export function Countdown() {
  const {
    activeTask,
    activeTaskId,
    markCurrentTaskAsFinished,
    amountSecondsPassed,
    setSecondsPassed,
  } = useContext(TasksContext);
  const totalSeconds = activeTask ? activeTask.minuteAmount * 60 : 0;
  const currentSeconds = activeTask ? totalSeconds - amountSecondsPassed : 0;

  const minutesAmount = Math.floor(currentSeconds / 60);
  const secondsAmount = currentSeconds % 60;

  const minutes = String(minutesAmount).padStart(2, "0");
  const seconds = String(secondsAmount).padStart(2, "0");

  useEffect(() => {
    if (activeTask) {
      document.title = `${minutes}:${seconds}`;
    }
  }, [minutes, seconds, activeTask]);

  useEffect(() => {
    let interval: number;
    if (activeTask) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeTask.startDate
        );
        if (secondsDifference >= totalSeconds) {
          markCurrentTaskAsFinished();
          setSecondsPassed(totalSeconds);
          clearInterval(interval);
        } else {
          setSecondsPassed(secondsDifference);
        }
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [
    activeTask,
    totalSeconds,
    activeTaskId,
    markCurrentTaskAsFinished,
    setSecondsPassed,
  ]);
  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  );
}
