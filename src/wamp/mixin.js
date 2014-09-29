'use strict'

var msgs= require('./msgs')

module.exports= {}

for(var i in msgs){
	// create properties for all of the messages' fields
	var msg= msgs[i],
	  properties= {}
	for(var j= 0; j< msg.fields.length; ++j){
		var fieldName= msg.fields[j],
		  property= (function(n){
			return {
				get: function(){
					return this[n]
				},
				set: function(value){
					this[n]= value
					return this
				},
				configurable: false,
				enumerable: true
			}
		})(fieldName, j)
		properties[fieldName]= property
	}
	(function(msg, properties){
		// build a new outter-level constructor for the message
		var fn= module.exports[msg.messageName]= function(){
			msg.apply(this, arguments)
			// probably faster, but more informal, duplicating properties
			//module.exports[msg.messageName].mixin(this)
		}
		// build prototype for the new constructor
		for(var i in properties){
			Object.defineProperty(fn.prototype, i, properties[i])
		}

		// build a mixin that just mixes in properties
		module.exports[msg.messageName].mixin= (function mixin(o){
			for(var i in properties)
				Object.defineProperty(o, i, properties[i])
		})
	})(msg, properties)
}
