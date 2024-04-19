type DebounceFunction = (...args: any[]) => any;

export function debounce(f: DebounceFunction, ms: number) {
  let isCooldown = false;

  return function(this: unknown, ...args: Parameters<DebounceFunction>) {
    if (isCooldown) return;

    f.apply(this, args);

    isCooldown = true;

    setTimeout(() => (isCooldown = false), ms);
  };
}
