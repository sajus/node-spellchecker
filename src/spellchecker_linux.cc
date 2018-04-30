#include "spellchecker.h"
#include "spellchecker_stub.h"

namespace spellchecker {

SpellcheckerImplementation* SpellcheckerFactory::CreateSpellchecker() {
  return new SpellcheckerStub();
}

}  // namespace spellchecker
