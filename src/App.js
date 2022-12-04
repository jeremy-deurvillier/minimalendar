import React, { useState } from 'react';
import Calendar from './calendar/calendar';
import './style.css';

export default function App() {
  const [infosDate, setInfosDate] = useState(null);

  function getSelectedDate(selectedDate) {
    setInfosDate(selectedDate);
  }

  return (
    <>
      <p>{infosDate ? infosDate.date : 'Aucune date sélectionnée.'}</p>
      <Calendar getData={getSelectedDate} />
    </>
  );
}
