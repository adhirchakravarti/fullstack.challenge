import React, { ReactElement } from 'react'
import style from './style.scss'

type NotificationBannerProps = {
  onDismiss?: React.MouseEventHandler<HTMLButtonElement>
}

const NotificationBanner = ({
  onDismiss,
}: NotificationBannerProps): ReactElement => {
  return (
    <div
      className={style.container}
      style={{ backgroundColor: '#BD4301', color: 'white' }}
    >
      <div className={style.message}>
        Oops we've encountered an error while refreshing the account
      </div>
      <div className={style.actions}>
        <button
          className={style.acknowledge}
          style={{ color: 'white' }}
          onClick={onDismiss}
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}

export default NotificationBanner
