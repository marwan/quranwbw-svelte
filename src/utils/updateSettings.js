import { userSettingsStore, wordTypeStore, displayTypeStore, verseTranslationsStore } from "./stores";
import { selectableVerseTranslations } from "./options";

// function to update website settings
export function updateSettings(type, value) {
  // get the settings from localStorage
  const userSettings = JSON.parse(localStorage.getItem("userSettings"));

  switch (type) {
    // for word types
    case "wordType":
      wordTypeStore.set(value);
      userSettings.displaySettings.wordType = value;
      break;

    // for display types
    case "displayType":
      displayTypeStore.set(value);
      userSettings.displaySettings.displayType = value;
      break;

    // for verse translations
    case "verseTranslation":
      let verseTranslationsArray = [];
      let translations = Object.keys(selectableVerseTranslations);

      // loop through all the available verse translations
      for (let translation = 1; translation <= translations[translations.length - 1]; translation++) {
        try {
          // we check if this translation is checked, if true, push to array
          if (document.getElementById(`verseTranslationCheckbox-${translation}`).checked) {
            verseTranslationsArray.push(translation);
          }
        } catch (error) {
          console.error(error);
        }
      }

      verseTranslationsStore.set(verseTranslationsArray);
      userSettings.translations.verse = verseTranslationsArray;
      break;
  }

  // update the settings back into localStorage
  userSettingsStore.set(JSON.stringify(userSettings));
  localStorage.setItem("userSettings", JSON.stringify(userSettings));
}