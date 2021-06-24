import { useState } from 'react'

import Account from 'src/models/Account'
import createAccount from 'lib/createAccount'

import getUpdatedAccount from './getUpdatedAccount'

const initialAccountValue = createAccount()

const useAccount = (): [Account, () => Promise<void>, boolean] => {
  const [account, setAccount] = useState<Account>(initialAccountValue)
  const [hasError, setHasError] = useState(false)
  const refreshAccount = async () => {
    try {
      const updatedAccount = await getUpdatedAccount(account)
      setAccount(updatedAccount)
      setHasError(false)
    } catch (e) {
      console.log('caught an error = ', e)
      setHasError(true)
    }
  }

  return [account, refreshAccount, hasError]
}

export default useAccount
