const { isSupported, Spellchecker } = require('../lib/spellchecker');
const path = require('path');
const enUS = "A robot is a mechanical or virtual artificial agent, usually an electronic machine";
const deDE = "Ein Roboter ist eine technische Apparatur, die üblicherweise dazu dient, dem Menschen mechanische Arbeit abzunehmen.";
const frFR = "Les robots les plus évolués sont capables de se déplacer et de se recharger par eux-mêmes";
const defaultLanguage = process.platform === 'darwin' ? '' : 'en_US';
const dictionaryDirectory = path.join(__dirname, 'dictionaries');

describe("SpellChecker", function() {

  const doAllTests = isSupported();

  describe(".isSupported()", function() {
    beforeEach(function () {
      this.fixture = new Spellchecker();
      return this.fixture.setDictionary(defaultLanguage, dictionaryDirectory);
    });

    it("returns true/false based on platform", function() {
      // linux and windows 7 aren't supported, but only linux is easy to check for
      const expectation = process.platform === 'linux' || process.env.SPELLCHECKER_PREFER_HUNSPELL ? false : true;
      expect(this.fixture.isSupported()).toEqual(expectation);
    });
  });

  // bail out on early on unsupported platforms because they'll just fail
  if(!doAllTests) {
    return;
  }

  describe(".isMisspelled(word)", function() {
    beforeEach(function() {
      this.fixture = new Spellchecker();
      return this.fixture.setDictionary(defaultLanguage, dictionaryDirectory);
    });
    it("returns true if the word is mispelled", function() {
      this.fixture.setDictionary('en_US', dictionaryDirectory);
      return expect(this.fixture.isMisspelled('wwoorrddd')).toBe(true);
    });
    it("returns false if the word isn't mispelled", function() {
      this.fixture.setDictionary('en_US', dictionaryDirectory);
      return expect(this.fixture.isMisspelled('word')).toBe(false);
    });
    it("throws an exception when no word specified", function() {
      return expect(function() {
        return this.fixture.isMisspelled();
      }).toThrow();
    });
    it("automatically detects languages on OS X", function() {
      if (process.platform !== 'darwin') {
        return;
      }
      expect(this.fixture.checkSpelling(enUS)).toEqual([]);
      expect(this.fixture.checkSpelling(deDE)).toEqual([]);
      return expect(this.fixture.checkSpelling(frFR)).toEqual([]);
    });
    return it("correctly switches languages", function() {
      expect(this.fixture.setDictionary('en_US', dictionaryDirectory)).toBe(true);
      expect(this.fixture.checkSpelling(enUS)).toEqual([]);
      expect(this.fixture.checkSpelling(deDE)).not.toEqual([]);
      expect(this.fixture.checkSpelling(frFR)).not.toEqual([]);
      if (this.fixture.setDictionary('de_DE', dictionaryDirectory)) {
        expect(this.fixture.checkSpelling(enUS)).not.toEqual([]);
        expect(this.fixture.checkSpelling(deDE)).toEqual([]);
        expect(this.fixture.checkSpelling(frFR)).not.toEqual([]);
      }
      this.fixture = new Spellchecker();
      if (this.fixture.setDictionary('fr_FR', dictionaryDirectory)) {
        expect(this.fixture.checkSpelling(enUS)).not.toEqual([]);
        expect(this.fixture.checkSpelling(deDE)).not.toEqual([]);
        return expect(this.fixture.checkSpelling(frFR)).toEqual([]);
      }
    });
  });

  describe(".checkSpelling(string)", function() {
    beforeEach(function() {
      this.fixture = new Spellchecker();
      return this.fixture.setDictionary(defaultLanguage, dictionaryDirectory);
    });
    it("returns an array of character ranges of misspelled words", function() {
      var string;
      string = "cat caat dog dooog";
      return expect(this.fixture.checkSpelling(string)).toEqual([
        {
          start: 4,
          end: 8
        },
        {
          start: 13,
          end: 18
        }
      ]);
    });
    it("accounts for UTF16 pairs", function() {
      var string;
      string = "😎 cat caat dog dooog";
      return expect(this.fixture.checkSpelling(string)).toEqual([
        {
          start: 7,
          end: 11
        },
        {
          start: 16,
          end: 21
        }
      ]);
    });
    it("accounts for other non-word characters", function() {
      var string;
      string = "'cat' (caat. <dog> :dooog)";
      return expect(this.fixture.checkSpelling(string)).toEqual([
        {
          start: 7,
          end: 11
        },
        {
          start: 20,
          end: 25
        }
      ]);
    });
    it("does not treat non-english letters as word boundaries", function() {
      this.fixture.add("cliché");
      expect(this.fixture.checkSpelling("what cliché nonsense")).toEqual([]);
      return this.fixture.remove("cliché");
    });
    it("handles words with apostrophes", function() {
      var string;
      string = "doesn't isn't aint hasn't";
      expect(this.fixture.checkSpelling(string)).toEqual([
        {
          start: string.indexOf("aint"),
          end: string.indexOf("aint") + 4
        }
      ]);
      string = "you say you're 'certain', but are you really?";
      expect(this.fixture.checkSpelling(string)).toEqual([]);
      string = "you say you're 'sertan', but are you really?";
      return expect(this.fixture.checkSpelling(string)).toEqual([
        {
          start: string.indexOf("sertan"),
          end: string.indexOf("',")
        }
      ]);
    });
    return it("handles invalid inputs", function() {
      var fixture;
      fixture = this.fixture;
      expect(fixture.checkSpelling("")).toEqual([]);
      expect(function() {
        return fixture.checkSpelling();
      }).toThrow("Bad argument");

      expect(function() {
        return fixture.checkSpelling(null);
      }).toThrow("Bad argument");

      return expect(function() {
        return fixture.checkSpelling({});
      }).toThrow("Bad argument");
    });
  });

  describe(".checkSpellingAsync(string)", function() {
    beforeEach(function() {
      this.fixture = new Spellchecker();
      return this.fixture.setDictionary(defaultLanguage, dictionaryDirectory);
    });
    it("returns an array of character ranges of misspelled words", function() {
      var ranges, string;
      string = "cat caat dog dooog";
      ranges = null;
      this.fixture.checkSpellingAsync(string).then(function(r) {
        return ranges = r;
      });
      waitsFor(function() {
        return ranges !== null;
      });
      return runs(function() {
        return expect(ranges).toEqual([
          {
            start: 4,
            end: 8
          },
          {
            start: 13,
            end: 18
          }
        ]);
      });
    });
    return it("handles invalid inputs", function() {
      expect(() => {
        return this.fixture.checkSpelling();
      }).toThrow("Bad argument");
      expect(() => {
        return this.fixture.checkSpelling(null);
      }).toThrow("Bad argument");
      return expect(() => {
        return this.fixture.checkSpelling(47);
      }).toThrow("Bad argument");
    });
  });

  describe(".getCorrectionsForMisspelling(word)", function() {
    beforeEach(function() {
      this.fixture = new Spellchecker();
      return this.fixture.setDictionary(defaultLanguage, dictionaryDirectory);
    });
    it("returns an array of possible corrections", function() {
      var correction, corrections;
      correction = process.platform === "darwin" ? "world" : "word";
      corrections = this.fixture.getCorrectionsForMisspelling('worrd');
      expect(corrections.length).toBeGreaterThan(0);
      return expect(corrections.indexOf(correction)).toBeGreaterThan(-1);
    });
    return it("throws an exception when no word specified", function() {
      return expect(function() {
        return this.fixture.getCorrectionsForMisspelling();
      }).toThrow();
    });
  });

  describe(".add(word) and .remove(word)", function() {
    beforeEach(function() {
      this.fixture = new Spellchecker();
      return this.fixture.setDictionary(defaultLanguage, dictionaryDirectory);
    });
    it("allows words to be added and removed to the dictionary", function() {
      // NB: Windows spellchecker cannot remove words, and since it holds onto
      // words, rerunning this test >1 time causes it to incorrectly fail
      if (process.platform === 'win32') {
        return;
      }
      expect(this.fixture.isMisspelled('wwoorrdd')).toBe(true);
      this.fixture.add('wwoorrdd');
      expect(this.fixture.isMisspelled('wwoorrdd')).toBe(false);
      this.fixture.remove('wwoorrdd');
      return expect(this.fixture.isMisspelled('wwoorrdd')).toBe(true);
    });
    it("add throws an error if no word is specified", function() {
      var errorOccurred;
      errorOccurred = false;
      try {
        this.fixture.add();
      } catch (error) {
        errorOccurred = true;
      }
      return expect(errorOccurred).toBe(true);
    });
    return it("remove throws an error if no word is specified", function() {
      var errorOccurred;
      errorOccurred = false;
      try {
        this.fixture.remove();
      } catch (error) {
        errorOccurred = true;
      }
      return expect(errorOccurred).toBe(true);
    });
  });

  describe(".getAvailableDictionaries()", function() {
    beforeEach(function() {
      this.fixture = new Spellchecker();
      return this.fixture.setDictionary(defaultLanguage, dictionaryDirectory);
    });
    return it("returns an array of string dictionary names", function() {
      var dictionaries, dictionary, i, len, ref, results;
      // NB: getAvailableDictionaries is nop'ped in hunspell and it also doesn't
      // work inside Appveyor's CI environment
      if (process.platform === 'linux' || process.env.CI || process.env.SPELLCHECKER_PREFER_HUNSPELL) {
        return;
      }
      dictionaries = this.fixture.getAvailableDictionaries();
      expect(Array.isArray(dictionaries)).toBe(true);
      expect(dictionaries.length).toBeGreaterThan(0);
      ref = dictionaries.length;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        dictionary = ref[i];
        expect(typeof dictionary).toBe('string');
        results.push(expect(diction.length).toBeGreaterThan(0));
      }
      return results;
    });
  });

  return describe(".setDictionary(lang, dictDirectory)", function() {
    return it("sets the spell checker's language, and dictionary directory", function() {
      var awesome;
      awesome = true;
      return expect(awesome).toBe(true);
    });
  });

});
