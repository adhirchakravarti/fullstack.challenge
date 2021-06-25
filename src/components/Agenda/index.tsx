import React, {
  ReactElement,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from 'react'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'
import cloneDeep from 'lodash/cloneDeep'

import greeting from 'lib/greeting'

import AgendaItem from 'src/models/AgendaItem'
import DepartmentMap from 'src/models/DepartmentMap'
import CalendarOption from 'src/models/CalendarOption'

import AccountContext from 'src/context/accountContext'

import NotificationBanner from '../NotificationBanner/NotificationBanner'
import GroupedAgenda from '../GroupedAgenda/GroupedAgenda'
import FilteredAgenda from '../FilteredAgenda/FilteredAgenda'

import style from './style.scss'

type AgendaProps = {
  showNotification: boolean
  onNotificationDismiss: React.MouseEventHandler<HTMLButtonElement>
}

export const compareByDateTime = (a: AgendaItem, b: AgendaItem): number =>
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
  const [showFilteredAgenda, setShowFilteredAgenda] = useState(true)
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

  const groupByDepartments = useCallback(() => {
    const newDepartments: DepartmentMap = {}
    events.forEach((eventItem) => {
      const {
        event: { department },
        event,
        calendar,
      } = eventItem
      if (newDepartments[department]) {
        if (newDepartments[department].events) {
          newDepartments[department].events.push({ calendar, event })
        } else {
          newDepartments[department].events = []
          newDepartments[department].events.push({ calendar, event })
        }
      } else if (department !== undefined && !newDepartments[department]) {
        newDepartments[department] = {
          name: department,
          events: [],
        }
        newDepartments[department].events.push({ calendar, event })
      }
    })
    console.log(newDepartments)
    return newDepartments
  }, [events])

  const memoizedDepartments = useMemo(groupByDepartments, [
    events,
    groupByDepartments,
  ])

  console.log(memoizedDepartments)

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

  const toggleAgendaView = () => {
    setShowFilteredAgenda((prevVal) => !prevVal)
  }

  return (
    <div className={style.outer}>
      {showNotification && (
        <NotificationBanner onDismiss={onNotificationDismiss} />
      )}
      <div className={style.container}>
        <div className={style.header}>
          <span className={style.title}>{title}</span>
          <button className={style.toggleButton} onClick={toggleAgendaView}>
            Toggle View
          </button>
        </div>
        {showFilteredAgenda && (
          <FilteredAgenda
            calendarOptions={calendars}
            selectedCalendar={selectedCalendar}
            onSelectCalendar={handleSelectCalendar}
            events={events}
          />
        )}
        {!showFilteredAgenda && (
          <GroupedAgenda departments={memoizedDepartments} />
        )}
      </div>
    </div>
  )
}

export default Agenda
