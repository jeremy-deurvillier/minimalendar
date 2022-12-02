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

  // Rendu
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

// Propriétés par défaut.
Calendar.defaultProps = {
  interval: [new Date().getFullYear()],
};
