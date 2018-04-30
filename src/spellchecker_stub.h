#ifndef SRC_SPELLCHECKER_STUB_H
#define SRC_SPELLCHECKER_STUB_H

#include "spellchecker.h"

namespace spellchecker {

class SpellcheckerStub : public SpellcheckerImplementation {
public:
  SpellcheckerStub();
  ~SpellcheckerStub();

  bool SetDictionary(const std::string &language, const std::string &path);
  std::vector<std::string> GetAvailableDictionaries(const std::string &path);
  std::vector<std::string> GetCorrectionsForMisspelling(const std::string &word);
  bool IsMisspelled(const std::string &word);
  std::vector<MisspelledRange> CheckSpelling(const uint16_t *text, size_t length);
  void Add(const std::string &word);
  void Remove(const std::string &word);
  bool IsSupported();
};

} // namespace spellchecker

#endif
