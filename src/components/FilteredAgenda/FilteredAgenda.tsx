import React, { ReactElement } from 'react'
import List from '../Agenda/List'
import Select from '../Select/Select'
import EventCell from '../Agenda/EventCell'
import AgendaItem from 'src/models/AgendaItem'
import CalendarOption from 'src/models/CalendarOption'

import style from './style.scss'

type FilteredAgendaProps = {
  events: AgendaItem[]
  selectedCalendar: CalendarOption
  calendarOptions: CalendarOption[]
  onSelectCalendar: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

const FilteredAgenda = ({
  events,
  selectedCalendar,
  calendarOptions,
  onSelectCalendar,
}: FilteredAgendaProps): ReactElement => {
  return (
    <>
      <div className={style.calendarFilter}>
        Filter By Calendar
        {selectedCalendar && (
          <Select
            options={calendarOptions}
            selectedOption={selectedCalendar}
            onChange={onSelectCalendar}
          />
        )}
      </div>

      <List>
        {events.map(({ calendar, event }) => (
          <EventCell key={event.id} calendar={calendar} event={event} />
        ))}
      </List>
    </>
  )
}

export default FilteredAgenda
