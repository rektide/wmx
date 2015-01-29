'use strict'

var NotImplemented= require('../err/not-implemented')

/*
typedef object JSON;
typedef (ArrayBuffer or ArrayBufferView or Blob or FormData or ScalarValueString or URLSearchParams) BodyInit;

interface Body {
	readonly attribute boolean bodyUsed;
	Promise<ArrayBuffer> arrayBuffer();
	Promise<Blob> blob();
	Promise<FormData> formData();
	Promise<JSON> json();
	Promise<ScalarValueString> text();
};
*/

module.exports= Body

function Body(){
	Body.mixin(this)
}

Body.mixin= (function mixin(o){
	o.bodyUsed= o.bodyUsed || false
	if(!(o instanceof Body)){
		var names= Object.getOwnPropertyNames(Body.prototype)
		for(var i in names){
			var name = names[i]
			if(o[name] === undefined){
				var descriptor = Object.getOwnPropertyDescriptor(Body.prototype, name)
				Object.defineProperty(o, name, descriptor)
			}
		}
	}
	return o
})

Body.prototype.arrayBuffer= NotImplemented.makeNotImplemented(Body, 'arrayBuffer')
Body.prototype.blob= NotImplemented.makeNotImplemented(Body, 'blob')
Body.prototype.formData= NotImplemented.makeNotImplemented(Body, 'formData')
Body.prototype.json= NotImplemented.makeNotImplemented(Body, 'json')
Body.prototype.text= NotImplemented.makeNotImplemented(Body, 'text')
