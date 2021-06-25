import React, { ReactElement } from 'react'
import style from './style.scss'

type NotificationBannerProps = {
  onDismiss?: React.MouseEventHandler<HTMLButtonElement>
  type: string
  notificationMessage: string
}

type colorKey = {
  [key: string]: string
}

const colorMap: colorKey = {
  error: '#BD4301',
  info: '#000066',
}

const NotificationBanner = ({
  onDismiss,
  type = 'info',
  notificationMessage,
}: NotificationBannerProps): ReactElement => {
  return (
    <div
      className={style.container}
      style={{ backgroundColor: 'white', color: colorMap[type] }}
    >
      <div className={style.message}>
        {`Oops we've encountered an ${notificationMessage.toLowerCase()} while refreshing the account`}
      </div>
      <div className={style.actions}>
        <button
          className={style.acknowledge}
          style={{ color: colorMap[type] }}
          onClick={onDismiss}
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}

export default NotificationBanner
