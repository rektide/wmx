var test= require("blue-tape"),
  msgs= require("wmx/wamp/msgs"),
  arrayReader= require("wmx/wamp/array-reader"),
  arrayWriter= require("wmx/wamp/array-writer")

var realm= "realm:basic"

test("array-reader deserializing a hello", function(t){
	var hello= arrayReader([1,realm,{}])
	t.ok(hello instanceof msgs.Hello, "is a Hello message")
	t.equal(hello.realm, realm, "message has a realm")
	t.end()
})

test("array-writer serializing a hello", function(t){
	var hello= new msgs.Hello(realm, {}),
	  arr= arrayWriter(hello)
	t.ok(arr instanceof Array, "is instance of array")
	t.equal(arr[0], msgs.Hello.messageType, "correct messageType")
	t.equal(arr[1], realm, "correct realm")
	t.end()
})
