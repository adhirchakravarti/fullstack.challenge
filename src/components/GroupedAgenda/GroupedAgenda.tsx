import React, { ReactElement } from 'react'
import List from '../Agenda/List'
import EventCell from '../Agenda/EventCell'
import DepartmentMap from 'src/models/DepartmentMap'
import { compareByDateTime } from '../Agenda'

import style from './style.scss'

type GroupedAgendaProps = {
  departments: DepartmentMap
}

const GroupedAgenda = ({ departments }: GroupedAgendaProps): ReactElement => {
  return (
    <>
      {Object.keys(departments).map((depKey) => {
        const department = departments[depKey]
        const { name, events } = department
        events.sort(compareByDateTime)
        return (
          <div key={name} className={style.department}>
            <div className={style.departmentTitle}>{name}</div>
            <List>
              {events.map(({ calendar, event }) => (
                <EventCell
                  key={event.id}
                  calendar={calendar}
                  event={event}
                  grouped
                />
              ))}
            </List>
          </div>
        )
      })}
    </>
  )
}

export default GroupedAgenda
