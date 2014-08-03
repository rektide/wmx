module.exports = {
	options: {
		reporter: 'spec',
		usePromises: true
	},
	mochaSelenium: {
		src: ['test/browser/**'],
		options: {
			browserName: 'chrome'
		}
	}
	
}
