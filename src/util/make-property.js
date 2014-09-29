'use strict'

module.exports= function(field, base){
	var ctx= base|| {}
	var def= base.default ? "||"+base.default : ""
	if(ctx.get === undefined) ctx.get= Function("return "+field+def)
	else if(ctx.get === null) delete ctx.get
	if(ctx.set === undefined) ctx.set= Function("value", field+"= value")
	else if(ctx.set === null) delete ctx.set
	if(ctx.configurable === undefined) ctx.configurable= false
	if(ctx.enumerable === undefined) ctx.enumerable= true
	//if(ctx.writable === undefined) ctx.writable= false
	return ctx
}
