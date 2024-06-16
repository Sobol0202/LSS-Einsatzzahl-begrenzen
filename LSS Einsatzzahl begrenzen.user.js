// ==UserScript==
// @name         LSS Einsatzzahl begrenzen
// @namespace    www.leitstellenspiel.de
// @version      1.0
// @description  Überprüft die aktuelle Einsatzzahl und setzt automatisch Pause oder Run
// @author       MissSobol
// @match        https://www.leitstellenspiel.de/
// @grant        none
// ==/UserScript==
/* global user_premium */

(function() {
    'use strict';

    // Festgelegter Grenzwert
    const threshold = 500; // Hier festlegen, wie viele Einsätze maximal kommen sollen

    // URLs für die unterschiedlichen Geschwindigkeiten abhängig vom Premium-Status
    const urlHighSpeed = "https://www.leitstellenspiel.de/missionSpeed?redirect_back=true&speed=6";
    const urlLowSpeedPremium = "https://www.leitstellenspiel.de/missionSpeed?redirect_back=true&speed=3";
    const urlLowSpeedNonPremium = "https://www.leitstellenspiel.de/missionSpeed?redirect_back=true&speed=2";

    // Variable, um den letzten Zustand zu speichern
    let lastStateHighSpeed = false;

    // Funktion zum Überprüfen der Einsatzzahl
    function checkEinsatzzahl() {
        // Überprüfen, ob die Variable user_premium existiert und ihren Wert ermitteln
        const userPremium = typeof user_premium !== 'undefined' ? user_premium : false;

        // Element mit der ID "mission_select_emergency" auswählen
        const einsatzElement = document.getElementById('mission_select_emergency');
        if (einsatzElement) {
            // Textinhalt des Elements auslesen
            const textContent = einsatzElement.textContent.trim();
            // Zahl nach dem / extrahieren
            const totalEinsaetze = parseInt(textContent.split('/')[1], 10);
            //console.log(`Gesamtzahl der Einsätze: ${totalEinsaetze} | Premium: ${userPremium}`);

            // Überprüfen, ob die Gesamtzahl der Einsätze den Grenzwert überschreitet
            if (totalEinsaetze > threshold && !lastStateHighSpeed) {
                // URL für Pause im Hintergrund aufrufen
                fetch(urlHighSpeed).then(response => console.log('Geschwindigkeit auf Pause gesetzt:', response));
                lastStateHighSpeed = true;
            } else if (totalEinsaetze <= threshold && lastStateHighSpeed) {
                // URL für Run im Hintergrund aufrufen, abhängig vom Premium-Status
                const urlLowSpeed = userPremium ? urlLowSpeedPremium : urlLowSpeedNonPremium;
                fetch(urlLowSpeed).then(response => console.log('Geschwindigkeit auf Run gesetzt:', response));
                lastStateHighSpeed = false;
            }
        } else {
            //console.log('Das Element mit der ID "mission_select_emergency" wurde nicht gefunden.');
        }
    }

    // Überprüfe die Einsatzzahl sofort beim Laden der Seite
    checkEinsatzzahl();

    // Überprüfe die Einsatzzahl alle 30 Sekunden (30000 Millisekunden)
    setInterval(checkEinsatzzahl, 30000);
})();
