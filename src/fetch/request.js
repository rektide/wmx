'use strict';

var Body= require('./body')

/*
typedef (Request or ScalarValueString) RequestInfo;

[Constructor(RequestInfo input, optional RequestInit init),
 Exposed=(Window,Worker)]
interface Request {
  readonly attribute ByteString method;
  readonly attribute ScalarValueString url;
  readonly attribute Headers headers;

  readonly attribute DOMString referrer;
  readonly attribute RequestMode mode;
  readonly attribute RequestCredentials credentials;

  Request clone();
};
Request implements Body;

dictionary RequestInit {
  ByteString method;
  HeadersInit headers;
  BodyInit body;
  RequestMode mode;
  RequestCredentials credentials;
};

enum RequestMode { "same-origin", "no-cors", "cors" };
enum RequestCredentials { "omit", "same-origin", "include" };
*/

module.exports= Request

function Request(){
	Body.mixin(this)
}

Request.mixin= (function mixin(o){
	Body.mixin(o)
	for(var i in Reqest.prototype){
		o[i]= Request.prototype[i]
	}
	return o
})
