# Chredirect

A Google Chrome extension for user-defined redirect rules. Works also in the new Opera browser.

## Usage
After installation the user can create rules for redirects. Each rule is defined as a pattern ([regular expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)) that requested URLs will be tested against. The first rule pattern that matches the URL (if any) will transform the URL using the user defined replacement (also regular expression).

The whole process takes place before sending the original request.
