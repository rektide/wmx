var _= require('lodash'),
  tape= require('blue-tape'),
  msgs= require('wmx/wamp/msgs'),
  Response= require('wmx/fetch/wamp/response')

tape('wamp response base use', function(t){
	var outp= {
		url: 'http://yoyodyne.net/wampterific',
		status: 200,
		headers: {
			'x-magic': 47
		},
		
	}
	var res= _.clone(outp)
	Response.mixin(res)

	t.equal(res.messageType, msgs.Result.messageType, 'messageType is Result')
	t.equal(res.status, outp.status, 'status is 200')
	t.equal(res.url, outp.url, 'url is url')
	t.equal(res.options.url, outp.url, 'options.url is url')
	t.deepEqual(res.headers['x-magic'], 47, '47 is magical')
	t.end()
})
