import React, { ReactElement, useEffect, useState } from 'react'

import runEvery from 'lib/runEvery'
import useAccount from 'lib/useAccount'
import AccountContext from 'src/context/accountContext'

import Agenda from './Agenda'

const REAL_TIME_UPDATES_INTERVAL = 10000

const Application = (): ReactElement => {
  const [account, refreshAccount, hasError, errorMessage] = useAccount()
  const [showNotification, setShowNotification] = useState(false)

  useEffect(
    () => runEvery(REAL_TIME_UPDATES_INTERVAL, refreshAccount),
    [refreshAccount],
  )

  useEffect(() => {
    if (hasError) {
      setShowNotification(true)
    } else {
      setShowNotification(false)
    }
  }, [hasError])

  const handleDismissNotification = () => {
    setShowNotification(false)
  }

  return (
    <AccountContext.Provider value={account}>
      <Agenda
        showNotification={showNotification}
        notificationMessage={errorMessage ? errorMessage : null}
        hasError={hasError}
        onNotificationDismiss={handleDismissNotification}
      />
    </AccountContext.Provider>
  )
}

export default Application
