import React, {
  ReactElement,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react'
import { DateTime } from 'luxon'

import greeting from 'lib/greeting'

import Calendar from 'src/models/Calendar'
import Event from 'src/models/Event'
import AccountContext from 'src/context/accountContext'

import List from './List'
import EventCell from './EventCell'

import style from './style.scss'
import NotificationBanner from '../NotificationBanner/NotificationBanner'

type AgendaItem = {
  calendar: Calendar
  event: Event
}

type AgendaProps = {
  showNotification: boolean
  onNotificationDismiss: React.MouseEventHandler<HTMLButtonElement>
}

const compareByDateTime = (a: AgendaItem, b: AgendaItem) =>
  a.event.date.diff(b.event.date).valueOf()

/**
 * Agenda component
 * Displays greeting (depending on time of day)
 * and list of calendar events
 */

const Agenda = ({
  showNotification,
  onNotificationDismiss,
}: AgendaProps): ReactElement => {
  const account = useContext(AccountContext)
  const [currentDateTime, setCurrentDateTime] = useState(DateTime.local())

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(DateTime.local())
    }, 1000)
    return () => {
      clearInterval(intervalId)
    }
  }, [])

  const events: AgendaItem[] = useMemo(
    () =>
      account.calendars
        .flatMap((calendar) =>
          calendar.events.map((event) => ({ calendar, event })),
        )
        .sort(compareByDateTime),
    [account],
  )

  const title = useMemo(
    () => greeting(currentDateTime.hour),
    [currentDateTime.hour],
  )

  return (
    <div className={style.outer}>
      {showNotification && (
        <NotificationBanner onDismiss={onNotificationDismiss} />
      )}
      <div className={style.container}>
        <div className={style.header}>
          <span className={style.title}>{title}</span>
        </div>

        <List>
          {events.map(({ calendar, event }) => (
            <EventCell key={event.id} calendar={calendar} event={event} />
          ))}
        </List>
      </div>
    </div>
  )
}

export default Agenda
