"use strict";

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

module.exports= Header
module.exports.forbidden= ["Accept-Charset", "Accept-Encoding", "Access-Control-Request-Headers",
  "Access-Control-Request-Method", "Connection", "Content-Length", "Cookie", "Cookie2", "Date", 
  "DNT", "Expect", "Host", "Keep-Alive", "Origin", "Referer", "TE", "Trailer", "Transfer-Encoding",
  "Upgrade", "User-Agent", "Via"] 
module.exports.forbiddenPrefix= [/^Proxy-/, /^Sec-/]
module.exports.asserts= false

function Headers(map){
	if(map.length){
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
	return this
}

Headers.prototype.append= function(key, value){
	if(this[key]
		this[key].push(value)
	else
		this[key] = [value]
}

Headers.prototype.delete= function(key){
	var asserts= !!module.exports.asserts
	if(asserts){
		if(!(key instanceof String)){
			throw new TypeError('cannot delete non-String-based header')
		}
		if(~module.exports.forbidden.indexOf(key))
			return
		for(var i in module.exports.forbiddenPrefix){
			var check= module.exports.forbiddenPrefix[i]
			if(check.test(name))
				return
		}
	}
	delete this[key]
}

Headers.prototype.get= function(key){
	var vals= this[key]
	if(vals)
		return vals[0]
}

Headers.prototype.getAll= function(key){
	return this[key] || []
}

Headers.prototype.has= function(key){
	return !!this[key]
}

Headers.prototype.set= function(key, value){
	this[key]= value.split(';').map(trim)
}


