import React, { ReactNode } from 'react'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'

// type WrappedComponentProps = {
//   props?: string
// }

function withErrorBoundary(WrappedComponent: React.ElementType): ReactNode {
  return () => {
    return (
      <ErrorBoundary>
        <WrappedComponent />
      </ErrorBoundary>
    )
  }
}

export default withErrorBoundary
