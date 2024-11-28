import { QueryClient } from "react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import FloatingStory from "./FloatingStory";

export default function FloatingBlock({ home }) {
  console.log("Home", home);
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <FloatingStory />
    </QueryClientProvider>
  );
}
