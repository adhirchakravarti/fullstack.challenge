import React, { ReactNode, ErrorInfo } from 'react'
import NotificationBanner from '../NotificationBanner/NotificationBanner'

type ErrorBoundaryState = {
  hasError: boolean
  errorName?: string | null
  errorMessage?: string | null
}

type ErrorBoundaryProps = {
  children: ReactNode
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      errorName: null,
      errorMessage: null,
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    if (error && error.message) {
      console.log('In error boundary = ', error.name)
      return {
        hasError: true,
        errorName: error.name,
        errorMessage: error.message,
      }
    }
    return { hasError: false }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.log('In error boundary = ', error, errorInfo)
  }

  render(): ReactNode {
    const { children } = this.props
    const { hasError, errorName, errorMessage } = this.state
    if (hasError && errorName && errorMessage) {
      return <NotificationBanner />
    }

    return children
  }
}

export default ErrorBoundary
