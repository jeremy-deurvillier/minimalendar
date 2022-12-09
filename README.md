# MinimalEndar

## Introduction

MinimalEndar (contraction des mots minimal et calendar) est un simple calendrier React. Il possède les fonctionnalités basique d'un calendrier :

- Vue du mois en cours
- Navigation entre les mois / années
- Possibilité de générer le calendrier entre une année X et une année Y
- Récupération des données du calendrier via un callback.

Vous pouvez voir le code et le rendu du projet sur [Stackblitz](https://stackblitz.com/edit/minimalendar).

## Installation

Commencez par cloner le dépôt :

```bash
git clone https://github.com/jeremy-deurvillier/minimalendar.git my-calendar
```

Installez ensuite les paquets :

```bash
cd my-calendar && npm install
```

Enfin, démarrer le projet :

```bash
npm run start
```

## Propriétés

Le calendrier possède deux propriétés optionnelles :

- interval : Permet de générer le calendrier entre deux années. Par défaut, seule l'année en cours est générée.
- getData : Permet de récupérer la date cliquée lors du clic sur ... une date du calendrier.

Exemples :

1. Générer le calendrier de janvier 2010 à décembre 2020 et récupérer la date cliquée.

```js
// Fichier App.js
import Calendar from 'components/calendar'

export default function App() {
  /* ** Récupère la date cliquée.
  */
  function getSelectedDate(dateinfos) {
    console.log(dateinfos);
  }

  /* ** Rendu ** */
  return (<div>
    <Calendar interval=[2010, 2020] getData={getSelectedDate} />
  </div>)
}
```

2. Générer le calendrier de l'année en cours et récupérer la date cliquée.

```js
// Fichier App.js
import Calendar from 'components/calendar'

export default function App() {
  /* ** Récupère la date cliquée.
  */
  function getSelectedDate(dateinfos) {
    console.log(dateinfos);
  }

  /* ** Rendu ** */
  return (<div>
    <Calendar getData={getSelectedDate} />
  </div>)
}
```

## Contributions

Si vous trouvez un intérêt à ce projet, n'hésitez pas à proposer vos modifications.

[Ecrit avec StackBlitz ⚡️](https://stackblitz.com)
