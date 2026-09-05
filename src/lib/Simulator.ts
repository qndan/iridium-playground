import { type SimulatorLoadAction, type SimulatorLoadResult, type SimulatorSimulateAction, type SimulatorSimulateResult } from "./SimulatorWorker";
import SimulatorWorker from "./SimulatorWorker.ts?worker";
import { WorkerPool } from "./taskPool";

export class Simulator {
  #workerPool: WorkerPool;

  constructor() {
    this.#workerPool = new WorkerPool(() => new SimulatorWorker());
  }

  async load(antimony: string, abortSignal?: AbortSignal) {
    return await this.#workerPool.runTask<SimulatorLoadAction, SimulatorLoadResult>(
      "load",
      undefined,
      antimony,
      abortSignal,
    );
  }

  async simulate(antimony: string, variables: Record<string, number>, abortSignal?: AbortSignal) {
    return await this.#workerPool.runTask<SimulatorSimulateAction, SimulatorSimulateResult>(
      "simulate",
      { startTime: 0, endTime: 20, numberOfPoints: 200, variables },
      antimony,
      abortSignal,
    )
  }
}
