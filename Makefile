install: 
	npm ci

publish:
	npm publish --dry-run

lint:
	npx eslint .

sum:
	npm src/bin/sum.js


