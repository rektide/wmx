module.exports= NotImplemented
module.exports.make= makeNotImplemented

function NotImplemented(message, name) {
	this.name = 'NotImplemented';
	this.message = message;
	this.stack = (new Error()).stack;
	return this
}
NotImplemented.prototype = new Error;

NotImplemented.mixin= NotImplemented


function makeNotImplemented(o, slot, message){
	var name= 'NotImplemented:'+(o.name||o)+'::'+slot + ': '
	return function(){
		throw new NotImplemented(message||'', name)
	}
}

NotImplemented.makeNotImplemented= makeNotImplemented
