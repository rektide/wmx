'use strict'

module.exports= function(field, base){
	var ctx= base|| {}
	if(!ctx.get) ctx.get= Function("return "+field)
	if(!ctx.set) ctx.set= Function("value", field+"= value")
	if(ctx.configurable === undefined) ctx.configurable= false
	if(ctx.enumerable === undefined) ctx.enumerable= true
	return ctx
}
