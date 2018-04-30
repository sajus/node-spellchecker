const { remote, webFrame } = require('electron');
const { Spellchecker } = require('../lib/spellchecker');

function main() {
  const spellchecker = new Spellchecker();
  const locale = remote.app.getLocale();
  spellchecker.setDictionary(locale.replace('-', '_'), '');

  console.log(locale);
  console.log(`Spellchecker is supported: ${spellchecker.isSupported()}`);

  webFrame.setSpellCheckProvider(locale, true, {
    // false = it's misspelled
    spellCheck(text) {
      return !spellchecker.isMisspelled(text);
    }
  });

  const textarea = document.querySelector('textarea');
  const suggestionsBox = document.querySelector('#suggestions');

  textarea.addEventListener('input', (event) => {
    const text = event.target.value;
    spellchecker.checkSpellingAsync(text).then(ranges => {
      let suggestions = ranges
        .map(r => {
          let word = text.substr(r.start, r.end);
          return `"${word}" could be: ${ spellchecker.getCorrectionsForMisspelling(word).join(', ') }`
        });

        suggestionsBox.innerHTML = suggestions.join('\n');
    });
  });
}

main();
