var global= (function(){
	return this
})()

module.exports= function(contextless){
	return global === contextless
}
