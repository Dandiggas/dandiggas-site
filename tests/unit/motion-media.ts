// A controllable matchMedia for jsdom: set which queries match, then fire
// "change" the way a browser does when the reader flips a system setting.
type Listener = (e: { matches: boolean }) => void;

export function installMatchMedia(initial: Record<string, boolean>) {
  const state = { ...initial };
  const listeners = new Map<string, Set<Listener>>();
  window.matchMedia = ((query: string) => {
    const set = listeners.get(query) ?? new Set<Listener>();
    listeners.set(query, set);
    return {
      media: query,
      get matches() {
        return !!state[query];
      },
      addEventListener: (_: string, l: Listener) => set.add(l),
      removeEventListener: (_: string, l: Listener) => set.delete(l),
      addListener: (l: Listener) => set.add(l),
      removeListener: (l: Listener) => set.delete(l),
      onchange: null,
      dispatchEvent: () => true,
    } as unknown as MediaQueryList;
  }) as typeof window.matchMedia;
  return {
    set(query: string, matches: boolean) {
      state[query] = matches;
      for (const l of listeners.get(query) ?? []) l({ matches });
    },
    listenerCount: (query: string) => listeners.get(query)?.size ?? 0,
  };
}
