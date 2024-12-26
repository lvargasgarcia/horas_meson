import registrateEvent from './modals/events.js';

document.getElementById("add-entry-button").addEventListener("click", () => registrateEvent(1));

document.getElementById("sign-up-button").addEventListener("click", () => registrateEvent(0));
