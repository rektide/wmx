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
})

Body.prototype.arrayBuffer= NotImplemented.makeNotImplemented(Body, 'arrayBuffer')
Body.prototype.arrayBuffer= NotImplemented.makeNotImplemented(Body, 'blob')
Body.prototype.arrayBuffer= NotImplemented.makeNotImplemented(Body, 'formData')
Body.prototype.arrayBuffer= NotImplemented.makeNotImplemented(Body, 'json')
Body.prototype.arrayBuffer= NotImplemented.makeNotImplemented(Body, 'text')
