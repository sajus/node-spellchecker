{
  'variables': {
    'conditions': [
      ['OS=="mac"', {
        'spellchecker_use_hunspell%': 'true',
      }],
      ['OS=="linux"', {
        'spellchecker_use_hunspell': 'true',
      }],
      ['OS=="win"', {
        'spellchecker_use_hunspell': 'true',
      }],
    ],
  },
  'target_defaults': {
    'cflags_cc': ['-std=c++11'],
    'conditions': [
      ['OS=="win"', {
        'msvs_disabled_warnings': [
          4267,  # conversion from 'size_t' to 'int', possible loss of data
          4530,  # C++ exception handler used, but unwind semantics are not enabled
          4506,  # no definition for inline function
        ],
      }],
      ['OS=="mac"', {
        'xcode_settings': {
           "OTHER_CPLUSPLUSFLAGS": ["-std=c++11", "-stdlib=libc++", "-mmacosx-version-min=10.7"]
        }
      }]
    ],
  },
  'targets': [
    {
      'target_name': 'spellchecker',
      'include_dirs': [ '<!(node -e "require(\'nan\')")' ],
      'sources': [
        'src/main.cc',
        'src/worker.cc'
      ],
      'conditions': [
        ['spellchecker_use_hunspell=="true"', {
          'sources': [
            'src/spellchecker_stub.cc',
          ],
        }],
        ['OS=="win"', {
          'sources': [
             'src/spellchecker_win.cc',
             'src/transcoder_win.cc',
          ],
        }],
        ['OS=="linux"', {
          'sources': [
             'src/spellchecker_linux.cc',
             'src/transcoder_posix.cc',
          ],
        }],
        ['OS=="mac"', {
          'sources': [
            'src/spellchecker_mac.mm',
            'src/transcoder_posix.cc',
          ],
          'link_settings': {
            'libraries': [
              '$(SDKROOT)/System/Library/Frameworks/AppKit.framework',
            ],
          },
        }],
      ],
    },
  ]
}
