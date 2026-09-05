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
  value: "A + B -> C; A * k1\nA = 10; B = 20; C = 0\nk1 = 2"
});

export const variables = $state<{value: Variable[]}>({
  value: [],
});

export const columns = $state({
  value: [],
});
