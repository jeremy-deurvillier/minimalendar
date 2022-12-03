/* ** Un calendrier minimaliste et configurable.
 * Par défaut affiche le mois actuel.
 * Possibilité d'affiché une période donnée via une props "interval".
 * Boutons "mois suivant" et "mois précédent".
 * Option pour sélectionner le mois
 * Option pour sélectionner l'année
 * Lors du clic sur une date, renvoie la date cliquée via un callback.
 */

import React, { useState, useEffect } from 'react';

import css from './calendar.module.css';

/* ** Fonction composant React.
 *
 * @param Array interval Une intervalle représentant la période qu'on veut affichée.
 */
export default function Calendar({ interval, getData }) {
  let today = new Date(); // Date du jour

  /* ** Les années dans la propriété interval sont-elles inférieur (inf) et/ou supérieur (sup)
   * à la date du jour ?
   */
  let inf = Math.min(...interval) <= today.getFullYear(); // true si la plus petite année dans interval est <= à l'année actuelle
  let sup = Math.max(...interval) >= today.getFullYear(); // true si la plus grande année dans interval est >= à l'année actuelle

  /* ** Définition du mois et de l'année à afficher.
   *   - month : Affiche le mois actuel si l'année actuelle est compris dans interval. Le mois de janvier sinon.
   *   - year  : Affiche l'année actuelle si cette dernière est compris dans interval. La plus petite année de l'intervalle sinon.
   */
  const [month, setMonth] = useState(inf && sup ? today.getMonth() : 0);
  const [year, setYear] = useState(
    inf && sup ? today.getFullYear() : Math.min(...interval)
  );

  // Etat des boutons "mois suivant" et "mois précédent".
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  // Date sélectionnée
  const [selectedDate, setSelectedDate] = useState(null);

  /* ** Décrémente le mois actuel de 1.
   * Passe à l'année précédente si le mois de janvier est affiché.
   */
  function prevMonth() {
    if (month - 1 > -1) {
      setMonth((oldMonth) => oldMonth - 1);
    } else {
      setMonth(11);
      setYear((oldYear) => oldYear - 1);
    }
  }

  /* ** Incrémente le mois actuel de 1.
   * Passe à l'année suivante si le mois de décembre est affiché.
   */
  function nextMonth() {
    if (month + 1 < 12) {
      setMonth((oldMonth) => oldMonth + 1);
    } else {
      setMonth(0);
      setYear((oldYear) => oldYear + 1);
    }
  }

  /* ** Modification de l'état des boutons "mois suivant" et "mois précédent"
   * aprés le rendu dans le DOM.
   *
   * * Le bouton "mois précédent" est désactivé si est affiché :
   *   - le mois de janvier ET la plus petite année de l'intervalle.
   * * Le bouton "mois suivant" est desactivé si est affiché :
   *   - le mois de décembre ET la plus grande année de l'intervalle.
   */
  useEffect(() => {
    setPrevBtnDisabled(month === 0 && year === Math.min(...interval));
    setNextBtnDisabled(month === 11 && year === Math.max(...interval));
  }, [month, year, interval]);

  /* ** Renvoie le nom du jour ou du mois dans la locale par défaut du navigateur.
   * Utilise l'objet Intl.
   *
   * @param Date date Un objet date dont on veut récupérer soit le jour, soit le mois.
   * @param Object options Un objet indiquant la valeur qu'on souhaite recevoir (soit le mois, soit le jour).
   *
   * @return String Le mois ou le jour demandé.
   */
  function i18n(date, options) {
    let lang = navigator.language;

    return new Intl.DateTimeFormat(lang, options).format(date);
  }

  /* ** Définit tous les mois d'une année.
   *
   * @return JSX Un rendu contenant la liste des mois dans des balises HTML "option".
   */
  function getMonthList() {
    let options = { month: 'long' };
    let currentMonth = 0;
    let date, month;

    const list = []; // Liste des mois

    for (; currentMonth < 12; currentMonth++) {
      date = new Date(today.getFullYear(), currentMonth, 1);
      month = i18n(date, options);

      list.push(
        <option key={currentMonth} value={currentMonth}>
          {month}
        </option>
      );
    }

    return list;
  }

  /* ** Change le mois affiché.
   *
   * @param Event e Un événement JS.
   */
  function changeMonth(e) {
    setMonth((oldMonth) => parseInt(e.target.value));
  }

  /* ** Définit toutes les années dans l'intervalle (propriété interval).
   *
   * @return JSX Un rendu contenant une liste d'années dans des balises HTML "option".
   */
  function getYearList() {
    let start = Math.min(...interval);
    let max = Math.max(...interval);
    let index = 0;

    const list = []; // Liste des années dans une intervalle.

    for (; start + index <= max; index++) {
      list.push(
        <option key={index} value={start + index}>
          {start + index}
        </option>
      );
    }

    return list;
  }

  /* ** Change l'année affichée.
   *
   * @param Event e Un événement JS.
   */
  function changeYear(e) {
    setYear((oldYear) => parseInt(e.target.value));
  }

  /* ** Affiche les jours de la semaine.
   * Seule les 2 premières lettres du jour sont affichées.
   *
   * @return JSX Un rendu contenant la liste des jours de la semaine.
   */
  function getWeekDay() {
    let options = { weekday: 'long' };
    let currentDay = 1;
    let date, day;

    const list = []; // Liste des jours de la semaine

    for (; currentDay < 8; currentDay++) {
      date = new Date(1989, 0, currentDay); // 1 janvier 1989
      day = i18n(date, options);

      list.push(<span key={currentDay}>{day.substring(0, 2)}</span>);
    }

    return list;
  }

  /* ** Calcul le décalage au début d'un mois.
   */
  function startMonthShift(gapNumber) {
    let index = 0;
    const list = [];

    while (index < gapNumber) {
      list.push(<div key={'gap-' + index}></div>);

      index += 1;
    }

    return list;
  }

  /* ** Affiche les jours du mois.
   *
   * @return JSX Un rendu contenant les jours du mois à afficher.
   */
  function getDayOfMonth() {
    let day = 1;
    let date = new Date(year, month, day);
    let gapStartMonth = startMonthShift(date.getDay());

    const list = []; // Liste des jours du mois

    while (date.getMonth() === month) {
      list.push(
        <div key={date.getDate()} onClick={changeSelectedDate}>
          {(date.getTime() === today.getTime())
          ?<span className={css.today}>{date.getDate()}</span>
          :<span>{date.getDate()}</span>
          }
        </div>
      );

      day++;
      date = new Date(year, month, day);
    }

    return [...gapStartMonth, ...list];
  }

  /* ** Modifie la date sélectionnée.
   * Appel le callback utilisateur s'il est défini.
   *
   * @param Event e Un événement JS.
   */
  function changeSelectedDate(e) {
    let selectedDay = parseInt(e.target.innerHTML);

    setSelectedDate((oldSelectedDate) => new Date(year, month, selectedDay));

    if (getData) getData(selectedDate);
  }

  // Rendu
  return (
    <div className={css.calendar}>
      <div className={css.calendarHeader}>
        <div className={css.navigation}>
          <div>
            <select value={month} onChange={changeMonth}>
              {getMonthList()}
            </select>
            <select value={year} onChange={changeYear}>
              {getYearList()}
            </select>
          </div>
          <div>
            <button onClick={prevMonth} disabled={prevBtnDisabled}>
              {'<'}
            </button>
            <button onClick={nextMonth} disabled={nextBtnDisabled}>
              {'>'}
            </button>
          </div>
        </div>
        <div className={css.dayList}>{getWeekDay()}</div>
      </div>
      <div className={css.calendarBody}>{getDayOfMonth()}</div>
    </div>
  );
}

// Propriétés par défaut.
Calendar.defaultProps = {
  //interval: [new Date().getFullYear()]
  interval: [2020, 2025]
};
