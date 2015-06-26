var async=require('async')
var _=require('underscore')
function edit_distance(a,b,del,ins,sub,debug){
	// edit distance between a and b
	// https://en.wikipedia.org/wiki/Edit_distance
	if(!del) del = function(x){return 1;}
	if(!ins) ins = function(x){return 1;}
	if(!sub) sub = function(x,y){return 1;}
	n=a.length
	m=b.length
	d=[]
	for(var i=0;i<=m;i++)
		d[i]=[]
	d[0][0]=0;
	for(var i=1;i<=m;i++)
		if(i==1)
			d[i][0]=del(b[0])
		else
			d[i][0]=d[i-1][0]+del(b[i-1])
	for(var i=1;i<=n;i++)
		if(i==1)
			d[0][i]=ins(a[0])
		else
			d[0][i]=d[0][i-1]+ins(a[i-1])
	for(var i=1;i<=m;i++)
		for(var j=1;j<=n;j++){
			if(a[j-1]==b[i-1])
				d[i][j]=d[i-1][j-1]
			else
				d[i][j]=Math.min(d[i-1][j]+del(b[i-1]),
						d[i][j-1]+ins(a[j-1]),
						d[i-1][j-1]+sub(a[j-1],b[i-1])
					)
		}
	if(debug)
		console.log(d)
	return d[m][n]
}
function fuzzy(name,params){
	list=params.list
	extract=params.extract||function(x){return x};
	return _.sortBy(_.map(list,function(obj){
		return { score:edit_distance(name,extract(obj),function(x){return 0.3;},function(x){return 2;},function(x,y){return 2;},false),
			original:obj}
		}),'score')
	// return _.map(list,extract)
}
module.exports={
	edit_distance:edit_distance,
	fuzzy:fuzzy
}
global.registry.register("search", module.exports);
