import { goto as svelteGoto } from '$app/navigation';

// Wrapper for navigation functions
export const navigate = {
  // Navigate to a new page
  goto: (path: string) => svelteGoto(path),
  
  // Navigate back
  back: () => window.history.back(),
  
  // Refresh the current page
  refresh: () => window.location.reload()
};
