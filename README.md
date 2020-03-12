[![Build Status](https://api.travis-ci.com/akramer-zibra/diversibute.svg?branch=master)](https://travis-ci.com/github/akramer-zibra/diversibute) [![Coverage Status](https://coveralls.io/repos/github/akramer-zibra/diversibute/badge.svg?branch=48-coveralls-integration)](https://coveralls.io/github/akramer-zibra/diversibute?branch=48-coveralls-integration)

# Diversibute ("diverse distribution")
Dieses JavaScript-Module dient dazu eine Gruppe in möglichst heterogene Untergruppen einzuteilen. Für die Bewertung der Heterogenität werden den Gruppenmitgliedern Eigenschaftswerte zugeschrieben, anhand derer die Algorithmen eine Heterogenität berechnen.

Dieses Modul ist wesentlich von der Idee der [Kreativen Felder](http://olaf-axel-burow.de/index.php/forschung/kreative-felder) von Olaf-Axel Burow inspiriert. Burow versteht Kreativität als ein Zusammenspiel mehrerer Personen und deren sozialen Eigenschaften. Seine Theorie ist eine Weiterentwicklung der [Feldtheorie](https://de.wikipedia.org/wiki/Feldtheorie_(Psychologie)) aus der Gestaltpsychologie beziehungsweise Gruppendynamik. Ein kreatives Feld ist ähnlich einem Magnetfeld: es ist durch die Polung seiner Bestandteile gekennzeichnet. Bei Kreativen Feldern ist ein Schlüssel die [Heterogenität](https://de.wikipedia.org/wiki/Heterogenit%C3%A4t_%28P%C3%A4dagogik%29) der Beteiligten.

## Installation 
Dieses Modul kann ohne weiteres in NodeJS Projekten eingebunden werden. Dies setzt eine [NodeJS](https://nodejs.org/en/download/) Laufzeitumgebung voraus.  

Anschließend das Modul einfach als Abhängigkeit über npm installieren `npm install diversibute@https://github.com/akramer-zibra/diversibute --save`

Es können auch spezifische Versionen des Moduls installiert werden. ies lässt sich dadurch erreichen, dass in der Github URL die gewünschte Version an das Ende anghängt wird, z.B. so `https://github.com/akramer-zibra/diversibute#0.3.0`

## Beispiel
Dieses Beispiel berechnet für eine Gruppe bestehend aus `19 Personen` und jeweils `3 Merkmalen` eine möglicht heterogene und ausgewogene Aufteilung in `4` Gruppen.

```javascript
var diversibute = require('diversibute')

// Beispiel Eingabedaten
var data = {
    A: [1.6, 0, 2.4],
    B: [8.6, 1.3, 6.2],
    C: [6.6, 1.2, 2.3],
    D: [6.6, 3.6, 0],
    E: [8.7, 4.1, 8.3],
    F: [1.2, 4.1, 1.4],
    G: [0, 1.2, 1.5],
    H: [2.7, 3.6, 5],
    I: [1.6, 7.8, 5.8],
    J: [1.2, 3.7, 0],
    K: [7.9, 0, 1.6],
    L: [9, 2.9, 0],
    M: [3.2, 7.4, 5.5],
    N: [7.3, 1.2, 8.7],
    O: [1.4, 7.8, 7.7],
    P: [1.5, 1, 1.2],
    Q: [8.1, 0, 2.6],
    R: [9.2, 0, 0],
    S: [6.4, 1.3, 0]
}

// Anzahl gewünschter Gruppen
var numberOfWishedGroups = 4;

// Gruppen berechnen
diversibute.diverse(data, numberOfWishedGroups, {results: 5}).then(result => {
    console.log(result)
})
```

Ein vollständiges Anwendungsbeispiel gibt es hier [diversibute-example](https://github.com/akramer-zibra/diversibute-example)

## Funktionsweise
Das Modul besitzt eine einzige Methode `diverse()` über die der Verteilalgorithmus ausgeführt wird.

| Parameter | Typ | Beschreibung |
|---|---|---|
| data | `Object` | Schlüssel sind Bezeichnungen der Gruppenmitglieder. Values sind Array-Collections mit Dezimalwerten zwischen `0` und `10`
| groups | `number` | Anzahl der gewünschten Gruppenanzahl
| settings | `Object` | [Konfigurationsobjekt](#Konfiguration)

### Konfiguration
Der Verteilalgorithmus lässt sich durch nachfolgende Konfigurationswerte steuern

| Wert | Typ | Beschreibung | default
|---|---|---|---|
| algorithmus | `string` | Wählt zwischen den beiden Algorithmen `genetic` und `monte-carlo` | `genetic`
| results | `number` | Definiert die Anzahl der gewünschten Resultate | `1`

### Ergebnis
Nachfolgende Tabelle erklärt die Datenstruktur der Ergebnisse

| Wert | Typ | Beschreibung
|---|---|---|
| input.data | `Object` | Die Eingabedaten
| input.groups | `number` | Die Anzahl an gewünschten Gruppen
| settings | `Object` | Die angewendete Konfiguration dieser Berechnung
| results | `Array` | Eine Array-Collection mit berechneten [Zusammensetzungen](#Struktur der berechneten Zusammensetzungen) Objekten

#### Struktur der berechneten Zusammensetzungen
| Wert | Typ | Beschreibung
|---|---|---|
| groups | `Array` | Ist ein Array mit Arrays. Letzteren Arrays beschreiben die berechneten Gruppenzusammensetzungen
| seq | `Array` | Eine sequentielle Repräsentation der berechneten Gruppenzusammensetzung. Die Werte stehen für Gruppen. Der Index enstspricht den Keys der Eingabewerte
| score | `number` | Der berechnete Fitness-Wert des Ergebnis. Höher ist besser 

## Advanced

### Spezielle Konfigurationswerte für genetic-Algorithmus
Diese Werte funktinieren ausschließlich für den `genetic`-Algorithmus

| Wert | Typ | Beschreibung | default
|---|---|---|---|
| populationStartSize | `number` | Definiert die Größe der Startpopulation | `40`
| populationMaxSize | `number` | Definiert die maximale Größe der Population | `100`
| evolutions | `number` | Definiert wieviele Evolutionen der Algorithmus durchläuft, bis er sein Ergebnis zurückgibt | `100`

#### Interception
| Wert | Typ | Beschreibung | default
|---|---|---|---|
| bunches | `number` | Definiert, in wievielen Schritten der genetische Algorithmus zum Ergebnis kommt | `1`
| interceptor | `Function` | Definiert eine Callback-Function, die während des Evolutionsprozesses aufgerufen wird. `bunsches` muss hierfür größer als `1` sein | `undefined`

## Testing
Der Code kann mithilfe des Skripts `npm test` durchgetestet werden.

## License
Dieses Modul ist unter der [GNU-GPLv3](LICENSE) lizensiert und aus diesem Grund frei zugänglich. 