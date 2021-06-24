import React from 'react'
import { render } from 'react-dom'

import Application from './components/Application'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'

const rootElement = document.createElement('div')

document.body.appendChild(rootElement)

render(
  <ErrorBoundary>
    <Application />
  </ErrorBoundary>,
  rootElement,
)
