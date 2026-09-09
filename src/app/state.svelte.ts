export type Variable = {
  type: "normal";
  name: string;
  visible: boolean;
} | {
  type: "settable";
  name: string;
  visible: boolean;
  default: number;
  value: number;
};

export const code = $state({
  value: "A -> C; A * k1\nB -> C; B * k2\nA = 10; B = 20; C = 0\nk1 = 2; k2 = 3"
});

export const variables = $state<{value: Variable[]}>({
  value: [],
});

export const columns = $state({
  value: [],
});
