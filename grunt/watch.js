module.exports = {
	options: {
		interrupt: true,
		atBegin: true
	},
	watch: {
		files: ['src/**', 'test/**'],
		tasks: ['test']
	}
}
