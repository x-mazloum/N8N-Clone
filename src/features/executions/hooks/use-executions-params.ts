import { useQueryStates } from "nuqs";
import { executionsParams } from "../params";

export const useExecutionParams = () => {
  return useQueryStates(executionsParams);
};
