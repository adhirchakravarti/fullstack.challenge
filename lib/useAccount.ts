import { useState } from 'react'

import Account from 'src/models/Account'
import createAccount from 'lib/createAccount'

import getUpdatedAccount from './getUpdatedAccount'

const initialAccountValue = createAccount()

const useAccount = (): [Account, () => Promise<void>, boolean, string] => {
  const [account, setAccount] = useState<Account>(initialAccountValue)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const refreshAccount = async () => {
    try {
      const updatedAccount = await getUpdatedAccount(account)
      setAccount(updatedAccount)
      setHasError(false)
      setErrorMessage(null)
    } catch (e) {
      setHasError(true)
      setErrorMessage(e.message)
    }
  }

  return [account, refreshAccount, hasError, errorMessage]
}

export default useAccount
