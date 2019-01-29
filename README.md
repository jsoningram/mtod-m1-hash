# Install

Clone this repo `git@github.com:jsoningram/mtod-m1-hash.git` and `cd
mtod-m1-hash`

Run `npm install`

# Usage

1. Create test accounts
	- `./create.sh <count> <env>`
2. Create user IDs and insert into DB
	- `SERVERLESS_ENV=<staging|preprod|production> node index.js`
3. Clean up
	- `rm *.csv`

# Notes

Please create a file called *keys.js* with the API keys. Format is as follows
```javascript
module.exports = {
	staging: {
		apiKey: ''
	},
	preprod: {
		apiKey: ''
	},
	production: {
		apiKey: ''
	}
}
```
