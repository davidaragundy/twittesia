type Props<T> = {
  values: readonly T[];
  random: () => number;
};

export const pickValue = <T>({ values, random }: Props<T>): T =>
  values[Math.floor(values.length * random())];
