var _= require('lodash'),
  tape= require('blue-tape'),
  msgs= require('../../../src/wamp/msgs'),
  Request= require('../../../src/fetch/wamp/request')

tape('wamp request base use', function(t){
	var inp= {
		method: 'post',
		url: 'http://yoyodyne.net/wampterific',
		headers: {
			'x-magic': 42
		}
	}
	var req= _.clone(inp)
	Request.mixin(req)

	t.equal(req.messageType, msgs.Call.messageType, 'messageType is Call')
	t.equal(req.method, inp.method.toUpperCase(), 'method is POST')
	t.equal(req.options.method, inp.method.toUpperCase(), 'options.method is POST')
	t.equal(req.url, inp.url, 'url is url')
	t.equal(req.options.url, inp.url, 'options.url is url')
	t.deepEqual(req.headers['x-magic'], 42, '42 is magical')
})
