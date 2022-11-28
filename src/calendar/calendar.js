import React, { useState, useEffect } from 'react';

export default function Calendar({ interval }) {
  let today = new Date();

  let inf = Math.min(...interval) <= today.getFullYear();
  let sup = Math.max(...interval) >= today.getFullYear();

  const [month, setMonth] = useState(inf && sup ? today.getMonth() : 0);
  const [year, setYear] = useState(
    inf && sup ? today.getFullYear() : Math.min(...interval)
  );

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  function prevMonth(e) {
    if (month - 1 > -1) {
      setMonth((oldMonth) => oldMonth - 1);
    } else {
      setMonth(11);
      setYear((oldYear) => oldYear - 1);
    }
  }

  function nextMonth(e) {
    if (month + 1 < 12) {
      setMonth((oldMonth) => oldMonth + 1);
    } else {
      setMonth(0);
      setYear((oldYear) => oldYear + 1);
    }
  }

  // Au montage du composant dans le DOM.
  useEffect(() => {
    setPrevBtnDisabled(month === 0 && year === Math.min(...interval));
    setNextBtnDisabled(month === 11 && year === Math.max(...interval));
  }, [month, year, interval]);

  return (
    <div>
      <p>
        {month + 1} {year}
      </p>
      <button type="button" onClick={prevMonth} disabled={prevBtnDisabled}>
        prev
      </button>
      <button type="button" onClick={nextMonth} disabled={nextBtnDisabled}>
        next
      </button>
    </div>
  );
}

Calendar.defaultProps = {
  interval: [2015, 2025],
};
