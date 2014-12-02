var test= require("blue-tape"),
  msgs= require("wmx/wamp/msgs"),
  byId= require("wmx/wamp/msgs-by-id")

test("MsgsById", function(t){
	t.equal(byId[1], msgs.Hello, "has a Hello message")
	t.equal(byId[2], msgs.Welcome, "has a Welcome message")
	t.end()
})
