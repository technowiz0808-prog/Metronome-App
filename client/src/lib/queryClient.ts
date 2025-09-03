// Simplified QueryClient for GitHub Pages deployment (no server)
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// For frontend-only deployment: Use metronomeStorage directly instead of API calls