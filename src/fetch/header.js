'use strict';

/*
[Constructor(optional HeadersInit init),
 Exposed=(Window,Worker)]
interface Headers {
  void append(ByteString name, ByteString value);
  void delete(ByteString name);
  ByteString? get(ByteString name);
  sequence<ByteString> getAll(ByteString name);
  boolean has(ByteString name);
  void set(ByteString name, ByteString value);
};
*/

module.exports= Headers
module.exports.forbidden= ['Accept-Charset', 'Accept-Encoding', 'Access-Control-Request-Headers',
  'Access-Control-Request-Method', 'Connection', 'Content-Length', 'Cookie', 'Cookie2', 'Date', 
  'DNT', 'Expect', 'Host', 'Keep-Alive', 'Origin', 'Referer', 'TE', 'Trailer', 'Transfer-Encoding',
  'Upgrade', 'User-Agent', 'Via'].map(lower)
module.exports.simpleHeader= ['Accept', 'Accept-Language', 'Content-Language', 'Content-Type'].map(lower)
module.exports.simpleMimeTypes= ['application/x-www-form-urlencoded', 'multipart/form-data', 'text/plain']
module.exports.forbiddenPrefix= [/^Proxy-/i, /^Sec-/i]
module.exports.asserts= false

function lower(str){
	return str.toLowerCase()
}

function trim(str){
	return str.trim()
}

function Headers(map, guards){
	/*if(map && map.getAll){
		// no way to iterate inputted Headers without messy deep cloning, yuck!
		// structural cloning is last
	}else*/ if(map && map.length){
		for(var i= 0; i < map.length; ++i){
			var el= map[i]
			if(!el || el.length != 2)
				throw new TypeError('Expected two elements in a header')
			this.append(el[0], el[1])
		}
	}else{
		for(var i in map)
			this[i]= map[i]
	}
	if(guards){
		this.guards= guards
	}
	return this
}

Headers.prototype.append= (function append(name, value){
	if(asserts){
		var forbidden = this._isFobidden(name, value)
		if(err.message)
			throw err
		if(err)
			return
	}
	if(this[name])
		this[name].push(value)
	else
		this[name] = [value]
})

Headers.prototype['delete']= (function _delete(name){
	if(asserts){
		var forbidden = this._isFobidden(name)
		if(err.message)
			throw err
		if(err)
			return
	}
	delete this[name]
})

Headers.prototype.get= (function get(name){
	var vals= this[name]
	if(vals)
		return vals[0]
})

Headers.prototype.getAll= (function getAll(name){
	return this[name] || []
})

Headers.prototype.has= (function has(name){
	return !!this[name]
})

Headers.prototype.set= (function set(name, value){
	if(asserts){
		var forbidden = this._isFobidden(name, value)
		if(err.message)
			throw err
		if(err)
			return
	}
	this[name]= value.split(';').map(trim)
})

Headers.prototype._isForbidden= (function _isForbidden(name, value){
	if(!(name instanceof String)){
		return TypeError('non-String-based header')
	}
	var lower=  name.toLowerCase()
	if(!~module.exports.forbidden.indexOf(lower))
		return true
	for(var i in module.exports.forbiddenPrefix){
		var check= module.exports.forbiddenPrefix[i]
		if(check.test(lower))
			return true
	}
	if(this.guards && this.guards.requestNoCors){
		if(~module.exports.simpleHeader.indexOf(lower))
			return true
		if(lower == 'content-type' && value !== undefined && ~module.exports.simpleMimeTypes.indexOf(value))
			return true
	}
	return false
})

