export interface NamedArrayLike {
  readonly columnNames: readonly string[];
  readonly rowNames: readonly string[];
  readonly rowCount: number;
  readonly columnCount: number;
  sliceColumn(index: number): number[];
}

type DemoOutputContent =
  | {
      type: "plot";
      title: string;
      labels: string[];
      data: [number[], ...number[][]];
    }
  | {
      type: "table";
      title: string;
      columnNames: string[];
      rowNames: string[];
      rows: number[][];
    }
  | {
      type: "slider";
      name: string;
      min: number;
      max: number;
      step: number;
      value: number;
    }
  | { type: "text"; text: string }
  | { type: "list"; title: string; items: readonly unknown[] };

export type DemoOutput = DemoOutputContent & { id: number };

export interface DemoApi {
  plot(data: NamedArrayLike | readonly (readonly number[])[], title?: string): void;
  table(data: NamedArrayLike | readonly (readonly number[])[], title?: string): void;
  slider(min: number, max: number, step: number, name: string): number;
  text(text: string): void;
  list(items: readonly unknown[], title?: string): void;
}

function isNamedArray(data: unknown): data is NamedArrayLike {
  if (typeof data !== "object" || data === null) return false;
  const candidate = data as Partial<NamedArrayLike>;
  return (
    Array.isArray(candidate.columnNames) &&
    typeof candidate.rowCount === "number" &&
    typeof candidate.columnCount === "number" &&
    Array.isArray(candidate.rowNames) &&
    typeof candidate.sliceColumn === "function"
  );
}

export function createDemo(
  onOutput: (output: DemoOutput) => void,
  sliderValues: Record<string, number>,
): DemoApi {
  let nextId = 0;
  const publish = (output: DemoOutputContent) => {
    onOutput({ ...output, id: ++nextId });
  };

  return {
    plot(data, title = "Plot") {
      let columns: number[][];
      let labels: string[];

      if (isNamedArray(data)) {
        if (data.columnCount < 2) {
          throw new TypeError("Demo.plot() needs at least an x column and one y column.");
        }
        columns = Array.from({ length: data.columnCount }, (_, index) =>
          data.sliceColumn(index),
        );
        labels = [...data.columnNames];
      } else if (Array.isArray(data)) {
        columns = data.map((column) => {
          if (!Array.isArray(column) || !column.every((value) => typeof value === "number")) {
            throw new TypeError("Demo.plot() expects a NamedArray or an array of numeric columns.");
          }
          return [...column];
        });
        labels = columns.map((_, index) => (index === 0 ? "x" : `Series ${index}`));
      } else {
        throw new TypeError("Demo.plot() expects a NamedArray or an array of numeric columns.");
      }

      if (columns.length < 2) {
        throw new TypeError("Demo.plot() needs at least an x column and one y column.");
      }
      const rowCount = columns[0].length;
      if (columns.some((column) => column.length !== rowCount)) {
        throw new TypeError("Demo.plot() requires all columns to have the same number of rows.");
      }

      const [xValues, ...yValues] = columns;
      if (!xValues || yValues.length === 0) {
        throw new TypeError("Demo.plot() needs at least an x column and one y column.");
      }

      publish({
        type: "plot",
        title,
        labels: labels.slice(1),
        data: [xValues, ...yValues],
      });
    },

    table(data, title = "Table") {
      let columns: number[][];
      let columnNames: string[];
      let rowNames: string[];

      if (isNamedArray(data)) {
        if (data.columnNames.length !== data.columnCount) {
          throw new TypeError("Demo.table() requires a name for every column.");
        }
        columns = Array.from({ length: data.columnCount }, (_, index) =>
          data.sliceColumn(index),
        );
        columnNames = [...data.columnNames];
        rowNames =
          data.rowNames.length === data.rowCount
            ? [...data.rowNames]
            : Array.from({ length: data.rowCount }, (_, index) => String(index + 1));
      } else if (Array.isArray(data)) {
        columns = data.map((column) => {
          if (!Array.isArray(column) || !column.every((value) => typeof value === "number")) {
            throw new TypeError("Demo.table() expects a NamedArray or an array of numeric columns.");
          }
          return [...column];
        });
        columnNames = columns.map((_, index) => `Column ${index + 1}`);
        const rowCount = columns[0]?.length ?? 0;
        rowNames = Array.from({ length: rowCount }, (_, index) => String(index + 1));
      } else {
        throw new TypeError("Demo.table() expects a NamedArray or an array of numeric columns.");
      }

      const rowCount = columns[0]?.length ?? 0;
      if (columns.some((column) => column.length !== rowCount)) {
        throw new TypeError("Demo.table() requires all columns to have the same number of rows.");
      }
      const rows = Array.from({ length: rowCount }, (_, rowIndex) =>
        columns.map((column) => column[rowIndex]),
      );

      publish({
        type: "table",
        title,
        columnNames,
        rowNames,
        rows,
      });
    },

    slider(min, max, step, name) {
      if (!Number.isFinite(min) || !Number.isFinite(max) || max < min) {
        throw new RangeError("Demo.slider() requires finite bounds with max greater than or equal to min.");
      }
      if (!Number.isFinite(step) || step <= 0) {
        throw new RangeError("Demo.slider() requires a finite step greater than zero.");
      }
      if (!name.trim()) {
        throw new TypeError("Demo.slider() requires a non-empty name.");
      }

      const currentValue = sliderValues[name] ?? (min + max) / 2;
      const boundedValue = Math.min(max, Math.max(min, currentValue));
      const steppedValue = min + Math.round((boundedValue - min) / step) * step;
      const value = Number(Math.min(max, Math.max(min, steppedValue)).toPrecision(12));
      sliderValues[name] = value;
      publish({ type: "slider", name, min, max, step, value });
      return value;
    },

    text(text) {
      publish({ type: "text", text: String(text) });
    },

    list(items, title = "List") {
      if (!Array.isArray(items)) {
        throw new TypeError("Demo.list() expects an array.");
      }
      publish({ type: "list", title, items: [...items] });
    },
  };
}
