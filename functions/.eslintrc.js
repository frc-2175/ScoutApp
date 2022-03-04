module.exports = {
	extends: "eslint:recommended",
	env: {
		browser: true,
		commonjs: true,
		es2021: true,
	},
	rules: {
		indent: [
			"warn",
			"tab",
		],
		"no-var": "error",
		"prefer-const": "warn",
		quotes: [
			"warn",
			"double",
		],
		semi: [
			"error",
			"always",
		],
		yoda: "error",
		"quote-props": [
			"error",
			"as-needed"
		],
		eqeqeq: [
			"error",
			"smart"
		]
	},
};
