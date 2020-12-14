// Buy and sell same diff?
// date created : Dec 14, 2020
// Looking to figure out if there's a y value I can buy at then add y to the original price to get a c amount of return.
// var x = 600, c = 1.2; var y=(x*(c - 1))/(1 +c); y;
// y = 54.54. 
// to get 1.2 (20% increase) return. If stock is $600 USD, then buy at 600 - 54.54 and sell at 600+54 to make 20%.  
- date created: Dec 13, 2020

function toFixed(x){
    return +(x.toFixed(2));
}
function computeDiff(x, c){
    return toFixed((x*(c - 1))/(1 +c));
}
function computeReturns(x, y){
    return toFixed((x + y) / (x - y));
}
function reportStrategy(x , c){
    const y = computeDiff(x, c);

    console.log({
        currentValue : x,
        valueDiff : y,
        buy : toFixed(x-y),
        buyChangePerc : toFixed((x-y)/x),
        sell : toFixed(x+y),
        sellChangePerc : toFixed((x+y)/x),
        targetedReturns : c,
        computedReturn : computeReturns(x, y)
    });
}

function init(){
    const x = 400;
    for(var i = 1.1; i < 1.6; i += 0.1){
        reportStrategy(x, i);
    }
}
init();
