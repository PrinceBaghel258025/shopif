import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import CarouselBlock from './CarouselBlock'

function CarouselQueryClientWrapper({home}) {
  const queryClient = useMemo(() => new QueryClient(), []);
  return (
    <QueryClientProvider client={queryClient}>
      <CarouselBlock home={home} />
    </QueryClientProvider>
  )
}

export default CarouselQueryClientWrapper