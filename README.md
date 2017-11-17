# Open Geo Tagger

Der "Open Geo Tagger" ist eine Softwarelösung der das Sammeln offener Daten mit Crowd Sourcing und Gamification verbindet. Dabei wurde ein Web Applikation mit Hilfe des MEAN-Stacks implementiert um Bürgern die Möglichkeit zu bieten mit Hilfe von Geolocation relevante Orte und Ereignisse zu erfassen.

Dieses Projekt wurde im Rahmen des WPF Open Data: Technik und Anwendungen im Studiengang Medieninformatik Master an der Technischen Hochschule Köln umgesetzt.

## Setup
1. MongoDB installieren
2. Datenbank erzeugen: `use opendata`
3. Repository clonen
4. `config.js` im Hauptverzeichnis erstellen und Inhalt übernehmen (siehe unten)
5. Server starten und über `https://localhost:3000` aufrufen

### Config.js
```javascript
module.exports = {
    'mongodb' : 'mongodb://localhost/opendata',
    'port' : 3000
};
```
