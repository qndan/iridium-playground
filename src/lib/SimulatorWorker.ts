import type { Action, ErrorResult, Result } from "./taskPool.ts";
import { buildAntimonyDocument } from "antimony-language/semantic";
import { compileToIridium } from "antimony-language/compile";
import { compile, createCvodeSimulator } from "antimony-language";

export type SimulatorLoadAction = Action<"load", undefined, string>;
export type SimulatorLoadResult = Result<{ runtimeModel: RuntimeModel, antimonyModel: AntimonyModel }>;

export type SimulatorSimulateAction = Action<
  "simulate",
  { startTime: number; endTime: number; numberOfPoints: number; variables: Record<string, number> },
  string
>;
export type SimulatorSimulateResult = Result<Float64Array>;

export type SimulatorAction =
  | SimulatorLoadAction
  | SimulatorSimulateAction;
export type SimulatorResult =
  | SimulatorLoadResult
  | SimulatorLoadAction;

let wrapperPromise: Promise<CvodeSimulator> | undefined;
let antimonyDocument;
let runtimeModel;

const ensureWrapper = (): Promise<CvodeSimulator> => {
  if (!wrapperPromise) {
    wrapperPromise = createCvodeSimulator();
    return wrapperPromise;
  } else {
    return wrapperPromise;
  }
};

const simulateTimeCourse = async ({
  startTime,
  endTime,
  numberOfPoints,
  variables,
}: SimulatorSimulateAction["payload"]): Promise<SimulatorSimulateResult["data"]> => {
  const wrapper = await ensureWrapper();

  wrapper.resetState();

  for (const [name, value] of Object.entries(variables)) {
    wrapper.setVariable(name, value);
  }

  // TODO: implement resetInitialConditions

  const output = wrapper.simulate(
    startTime,
    endTime,
    numberOfPoints,
  );

  return output.buffer;
};

const wrapResult = <T>(action: Action, data: T): Result<T> => ({
  id: action.id,
  data: data,
});

self.onmessage = async (e: MessageEvent<unknown>) => {
  try {
    const action = e.data as SimulatorAction;
    if (action.internalState) {
      antimonyDocument = buildAntimonyDocument(action.internalState);
      const iridiumModel = compileToIridium(antimonyDocument);
      runtimeModel = await compile(iridiumModel);
      if (!runtimeModel) throw new Error("Unable to compile model.");

      await (
        await ensureWrapper()
      ).setModel(runtimeModel);
    }

    switch (action.type) {
      case "load": {
        self.postMessage(
          wrapResult(action, {
            antimonyModel: antimonyDocument.models.get(
              antimonyDocument.exportedModel,
            ),
            runtimeModel,
          }),
        );

        break;
      }

      case "simulate": {
        const result = wrapResult(
          action,
          await simulateTimeCourse(action.payload),
        );
        self.postMessage(result, { transfer: [result.data.buffer] });
        break;
      }

      default:
        throw new Error("unknown action type");
    }
  } catch (err) {
    self.postMessage({
      id: (e.data as IridiumSimulatorAction).id,
      errorMessage: String(err),
    } satisfies ErrorResult);

    throw err;
  }
};
