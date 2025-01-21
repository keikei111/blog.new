import { writable } from 'svelte/store';

// Example store for managing page state
export const pageStore = writable({
  loading: false,
  error: null as string | null,
  data: null as any
});
