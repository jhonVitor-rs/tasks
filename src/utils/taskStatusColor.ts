import { taskStatus } from "@/constants/status";

export function StatusColor(status: taskStatus) {
  switch (status) {
    case taskStatus.TO_DO:
      return "#4c1d95";
    case taskStatus.IN_PROGRESS:
      return "#164e63";
    case taskStatus.PAUSED:
      return "#78350f";
    case taskStatus.COMPLETED:
      return "#14532d";
    case taskStatus.CANCELED:
      return "#7f1d1d";
    default:
      return "#18181b";
  }
}