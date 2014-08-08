var msgs= require('../wamp/msgs')

function makeAbortSnoop(self, clientAbort){
	if(!clientAbort)
		clientAbort= false

	// snoop on abort events send out on pipe
	function _abortSnoop(abort){
		if(!(abort instanceof msgs.Abort))
			return abort
		var ctx= {abort:abort, clientAbort: clientAbort, pipe:this}
		self.emit('abort', ctx)
	}
	_abortSnoop.owner= self

	function addPipe(pipe){
		// snoop inserted just before sending
		pipe._send.splice(pipe._send.length-2, 0, _abortSnoop)
	}
	_abortSnoop.addPipe= addPipe

	function removePipe(pipe){
		// clear out abortSnoops
		for(var i= pipe._send.length - 1; i >= 0; --i){
			if(pipe._send[i].owner == self){
				pipe._send.splice(i, 1)
			}
		}
	}
	_abortSnoop.removePipe= removePipe

	return _abortSnoop
}

module.exports= makeAbortSnoop
