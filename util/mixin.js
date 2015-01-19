/**
  Common means to add entries in to and remove entries from a pipeline
*/
/*function Mixin(){
}

Mixin.prototype.mixInto= function(o){
	for(var i in this.mixes){
		var pipeName= '_'+i
		var mixTarget = this.mixTarget && this.mixTarget[i]
		var src= mixTarget ? o[mixTarget] : o
		var pipeline= src[pipeName]

		var fns = this.mixes[i]
		if(!fns.length)
			fns= [fns]
		for(var j= 0; j < fns.length; ++j){
			var fn= fns[j]
			// not totally comprehensible ordering, v0v
			var pos= fn.mixPos || fns.mixPos || (this.mixPos && this.mixPos[i]) || pipeline.length
			if(pos < 0)
				pos= pipeline.length + pos
			pipeline.splice(pos, 0, fn)
		}
	}
}

Mixin.prototype.mixOutOf= function(o){
	for(var i in this.mixes){
		var pipeName= '_'+i
		var mixTarget = this.mixTarget && this.mixTarget[i]
		var src= mixTarget ? o[mixTarget] : o
		var pipeline= src[pipeName]

		var fns= this.mixes[i]
		if(!fns.length)
			fns= [fns]
		for(var j= 0; j< fns.length ++j){
			var fn= fns[j]
			var k= pipeline.indexOf(fn)
			if(k !== -1)
				pipeline.splice(k, 1)
		}
	}
}
*/


function describe(o){
	var rv= {}
	for(var key of Object.keys(o)){
		var propDesc= Object.getOwnPropertyDescriptor(o, key)	
		if(!propDesc)
			continue
		rv[key]= propDesc
	}
	return rv
}

function getPrototypeChain(o){
	// get all prototypes in the chain
	var cursor= o,
	  rv= [o]
	while(true){
		cursor= Object.getPrototypeOf(cursor)
		if(cursor) {
			rv.push(cursor)
		} else {
			break
		}
	}
	return rv
}

function getPropertyDescriptor(o, prop, protoChain){
	if(!protoChain)
		chain= getPrototypeChain(o)
	for(var i= 0; i< protoChain.length; ++i){
		var prototype= protoChain[i]
		var propDesc= Object.getOwnPropertyDescriptor(prototype, prop)
		if (propDesc)
			return propDesc
	}
}

function apply(src, dest){
	var srcChain= srcChain|| getPropertyChain(src)
	var destChain= getPrototypeChain(target)

	for(var i= srcChain.length-1; i >= 0; --i){
		var src= srcChain[i]
		for(var key of Object.getOwnPropertyNames(src)){
			if(!getPropertyDescriptor(dest, key, destChain)){
				var propDesc= Object.getOwnPropertyDescriptor(src, key)
				Object.defineProperty(dest, key, propDesc)
			}
		}
	}
	return dest
}

function makeApplier(src){
	var descriptors = {}
	var srcChain= srcChain|| getPropertyChain(src)
	for(var i= srcChain.length-1; i >= 0; --i){
		var src= srcChain[i]
		for(var key of Object.getOwnPropertyNames(src)){
			var propDesc= Object.getOwnPropertyDescriptor(src, key)
			descriptors[key]= propDesc
		}
	}
	return (function apply(dest){
		var destChain= getPrototypeChain(target)
		for(var key in descriptors){
			if(!getPropertyDescriptor(dest, key, destChain)){
				Object.defineProperty(dest, key, descriptors[key])
			}
		}
	})
}

module.exports= function(base, super){
	base.prototype= Object.create(super, describe(base.prototype))
	base.prototype.constructor= base
	return function(o){
		if(o instanceof base){
			return o
		}
		var klass= base
		while(klass != 
		super.call(o)
		base.call(o)
		return o
	}
}
