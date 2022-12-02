/* ** Un calendrier minimaliste et configurable.
 * Par défaut affiche le mois actuel.
 * Possibilité d'affiché une période donnée via une props "interval".
 * Boutons "mois suivant" et "mois précédent".
 * Option pour sélectionner le mois
 * Option pour sélectionner l'année
 * Lors du clic sur une date, renvoie la date cliquée via un callback.
 */

import React, { useState, useEffect } from 'react';

/* ** Fonction composant React.
 *
 * @param Array interval Une intervalle représentant la période qu'on veut affichée.
 */
export default function Calendar({ interval }) {
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
    setMonth((oldYear) => parseInt(e.target.value));
  }

  // Rendu
  return (
    <div className="calendar">
      <div className="calendarHeader">
        <div className="navigation">
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
        <div className="dayList"></div>
      </div>
      <div className="calendarBody"></div>
    </div>
  );
}

// Propriétés par défaut.
Calendar.defaultProps = {
  interval: [new Date().getFullYear()],
};
