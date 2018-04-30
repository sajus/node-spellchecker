#include "spellchecker_stub.h"

namespace spellchecker {

SpellcheckerStub::SpellcheckerStub() {}
SpellcheckerStub::~SpellcheckerStub() {}

bool SpellcheckerStub::SetDictionary(const std::string &language, const std::string &path) {
  return true;
}

std::vector<std::string> SpellcheckerStub::GetAvailableDictionaries(const std::string &path) {
  return std::vector<std::string>();
}

std::vector<std::string> SpellcheckerStub::GetCorrectionsForMisspelling(const std::string &word) {
  return std::vector<std::string>();
}

bool SpellcheckerStub::IsMisspelled(const std::string &word) {
  return false;
}

std::vector<MisspelledRange> SpellcheckerStub::CheckSpelling(const uint16_t *text, size_t length) {
  return std::vector<MisspelledRange>();
}

void SpellcheckerStub::Add(const std::string &word) {}

void SpellcheckerStub::Remove(const std::string &word) {}

bool SpellcheckerStub::IsSupported() {
  return false;
}

}
