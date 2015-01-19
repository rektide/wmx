var global= (function(){
	return this
})()

module.exports= function(ctx){
	return global === contextless
}
