# WWDC PING

Get email when WWDC site has been updated

Requires Node.js and nodemailer.

## How-To

* Create a credentials.js file in the root of the project as:

```javascript
var	user = 'yourmail@gmail.com';
var	pass = 'fancy password';
var sender = 'reply-to@yourmail.com';
var recipients = 'mail1@mail.com'; // comma-seperated list of recpienets

module.exports.user = user
module.exports.pass = pass;
module.exports.sender = sender;
module.exports.recipients = recipients;
```

* Deploy in your favorite node.js environment

## Support
I will support this code as long as it interests me. Try [@mcritz on App.net](https://alpha.app.net/mcritz) or [@mike_critz on twitter](https://twitter.com/mike_critz)

### License

Copyright 2013 Michael Critz

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
