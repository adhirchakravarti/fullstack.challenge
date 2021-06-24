import React, {
  ReactElement,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'

import greeting from 'lib/greeting'

import Calendar from 'src/models/Calendar'
import Event from 'src/models/Event'
import AccountContext from 'src/context/accountContext'

import List from './List'
import EventCell from './EventCell'

import style from './style.scss'
import NotificationBanner from '../NotificationBanner/NotificationBanner'
import cloneDeep from 'lodash/cloneDeep'
import Select from '../Select/Select'
import CalendarOption from 'src/models/CalendarOption'

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
  const [selectedCalendar, setSelectedCalendar] = useState(null)
  const initialVal = {
    id: uuid(),
    name: 'All Calendars',
    color: '#000',
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(DateTime.local())
    }, 1000)
    return () => {
      clearInterval(intervalId)
    }
  }, [])

  useEffect(() => {
    setSelectedCalendar(initialVal)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const events: AgendaItem[] = useMemo(() => {
    if (
      !selectedCalendar ||
      (selectedCalendar && selectedCalendar.name === 'All Calendars')
    ) {
      return account.calendars
        .flatMap((calendar) =>
          calendar.events.map((event) => ({ calendar, event })),
        )
        .sort(compareByDateTime)
    } else {
      const calendarIndex = account.calendars.findIndex(
        (cal) => cal.id === selectedCalendar.id,
      )
      if (calendarIndex > -1) {
        const activeCal = account.calendars[calendarIndex]
        return activeCal.events
          .map((event) => ({
            calendar: activeCal,
            event,
          }))
          .sort(compareByDateTime)
      }
    }
  }, [account.calendars, selectedCalendar])

  const title = useMemo(
    () => greeting(currentDateTime.hour),
    [currentDateTime.hour],
  )

  console.log(account, events)

  const calendars: CalendarOption[] = useMemo(() => {
    if (account && account.calendars) {
      const initialVal = {
        id: uuid(),
        name: 'All Calendars',
        color: '#000',
      }
      const initialOptions = [initialVal]
      const options = account.calendars.reduce((acc, curr, i) => {
        const clonedCal = cloneDeep(curr)
        delete clonedCal.events
        const newCal = {
          ...clonedCal,
          name: `Calendar-${i + 1}`,
        }
        return acc.concat(newCal)
      }, initialOptions)
      return options
    } else {
      return []
    }
  }, [account])

  const handleSelectCalendar = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value)
    const targetCalName = e.target.value
    const calendarIndex = calendars.findIndex(
      (cal) => cal.name === targetCalName,
    )
    if (calendarIndex > -1) {
      const newlySelectedCalendar = calendars[calendarIndex]
      console.log('new active cal = ', newlySelectedCalendar)
      setSelectedCalendar(newlySelectedCalendar)
    }
  }

  return (
    <div className={style.outer}>
      {showNotification && (
        <NotificationBanner onDismiss={onNotificationDismiss} />
      )}
      <div className={style.container}>
        <div className={style.header}>
          <span className={style.title}>{title}</span>
        </div>
        <div className={style.calendarFilter}>
          Filter By Calendar
          {selectedCalendar && (
            <Select
              options={calendars}
              selectedOption={selectedCalendar}
              onChange={handleSelectCalendar}
            />
          )}
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
