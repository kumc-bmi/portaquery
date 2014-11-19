(flycheck-define-checker javascript-flow
  "A JavaScript syntax and style checker using Flow.

See URL `http://flowtype.org/'."
  :command ("flow" source-inplace)
  :error-patterns ((error line-start
			  (file-name) ":" line ":" (one-or-more not-newline) ":" (message)
			  line-end))
  :modes (js-mode))
(add-to-list 'flycheck-checkers 'javascript-flow t)
