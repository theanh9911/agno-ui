import React, { Suspense } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'sonner'
import { ThemeProvider } from 'next-themes'

import AppRouter from '@/routers/AppRouter'
import { PostHogProvider } from '@/providers/PostHogProvider'
import ReactQueryProvider from '@/providers/ReactQueryProvider'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { NetworkStatusProvider } from '@/providers/NetworkStatusProvider'
import { DialogProvider } from '@/providers/DialogProvider'
import { SheetProvider } from '@/providers/SheetProvider'
import LoadingPage from '@/components/common/LoadingPage/LoadingPage'
import { PostHogIdentifier } from '@/components/common/PostHogIdentifier/PostHogIdentifier'

import configureAPI from '@/api/config'
import { cn } from '@/utils/cn'
import { fontInter, fontDMMono } from '@/utils/fonts'
import './globals.css'

// Initialize API configuration (backend)
configureAPI()

function App() {
  return (
    <div
      className={cn(
        'min-h-screen overflow-x-hidden bg-background font-inter antialiased',
        fontInter.variable,
        fontDMMono.variable
      )}
    >
      <HelmetProvider>
        <PostHogProvider>
          <ReactQueryProvider>
            <ReactQueryDevtools initialIsOpen={false} />
            <Suspense fallback={<LoadingPage />}>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
              >
                <NetworkStatusProvider>
                  <DialogProvider>
                    <SheetProvider>
                      <PostHogIdentifier />
                      <AppRouter />
                    </SheetProvider>
                  </DialogProvider>
                </NetworkStatusProvider>

                <Toaster />
              </ThemeProvider>
            </Suspense>
          </ReactQueryProvider>
        </PostHogProvider>
      </HelmetProvider>
    </div>
  )
}

export default App
