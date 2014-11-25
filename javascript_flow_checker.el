;; ack: http://lbolla.info/blog/2014/11/19/flycheck-checker-for-javascript-flow
(flycheck-define-checker javascript-flow
  "A JavaScript syntax and style checker using Flow.

See URL `http://flowtype.org/'."
  :command ("flow" "check" "--lib" "lib" source-original)
  :error-patterns
  ((error line-start
	  (file-name)
	  ":"
	  line
	  ":"
	  (minimal-match (one-or-more not-newline))
	  ": "
	  (message (minimal-match (and (one-or-more anything) "\n")))
	  line-end))
  :modes js-mode)

(add-to-list 'flycheck-checkers 'javascript-flow)
(flycheck-add-next-checker 'javascript-gjslint 'javascript-flow)
(flycheck-add-next-checker 'javascript-jshint 'javascript-flow)
