import React, { ReactElement } from 'react'
import { DateTime } from 'luxon'
import Color from 'color'

import Event from 'src/models/Event'
import Calendar from 'src/models/Calendar'

import style from './style.scss'

/**
 * Format a date-time to time only string
 */

const formatWhen = (dt: DateTime) => dt.toFormat(dt.minute ? 'h:mm a' : 'h a')

/**
 * Event cell component
 * Displays time of event, title and department (if any)
 */

interface Props {
  calendar: Calendar
  event: Event
  grouped?: boolean
}

const EventCell = ({ calendar, event, grouped }: Props): ReactElement => {
  const cardBgColor = Color(calendar.color).alpha(0.1).string()
  const titleColor = Color(calendar.color)
    .alpha(0.8)
    .mix(Color('#000'), 0.4)
    .string()

  return (
    <div className={`${style.outer} ${grouped ? `${style.grouped}` : ''}`}>
      <div className={style.when}>{formatWhen(event.date)}</div>
      <div className={style.card} style={{ backgroundColor: cardBgColor }}>
        <div className={style.cardTitle} style={{ color: titleColor }}>
          <span>{event.title}</span>
          {!!event.department && <span>{event.department}</span>}
        </div>
      </div>
    </div>
  )
}

export default EventCell
