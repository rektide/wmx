var test= require("blue-tape"),
  msgs= require("../../../src/wamp/msgs"),
  byId= require("../../../src/wamp/msgs-by-id")

test("MsgsById", function(t){
	t.equal(byId[1], msgs.Hello, "has a Hello message")
	t.equal(byId[2], msgs.Welcome, "has a Welcome message")
	t.end()
})
