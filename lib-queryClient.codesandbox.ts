// Simple queryClient for CodeSandbox - no server functionality
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

// For CodeSandbox: Direct storage operations instead of API calls
// Use metronomeStorage directly in your components instead of these functions