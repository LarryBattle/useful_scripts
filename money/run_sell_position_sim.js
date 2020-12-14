// Investment Plan - Given the sum of your investment pool, how much will you make if buy and sell stocks at a given price
// author: larry battle
// given money and percent to sale, and price hits all what's the rate of return
// {percentOfSum : percentPriceChange }
// results with meta data
// {  ???? }
// input: starting point, sell options, highest point hit
// output: final cash position state, results
const TAX_RATE = 0.3;
const HOLDING_TAX_RATE = (1 - TAX_RATE);

var sellAtScaleByPerc = function( stockPriceBoughtAt, stockCount, percSellPositions /* []{ sellAt :x, sellPerc: .y } */, allTimeHigh ){
    const sellPositions = percSellPositions.map(p => {
        const o = {...p}
        if(!p.sellAtPerc){
            throw new Error("sellAtPerc doesn't exist on object: " + toJSON(p));
        }
        o.sellStockCount = Math.floor( stockCount * p.sellPerc);
        o.sellAt = Math.floor(p.sellAtPerc * stockPriceBoughtAt);
        return o;
    });

    const sumStock = sellPositions.reduce( (s, c) => {
        s += c.sellStockCount
        return s;
    }, 0);

    sellPositions[0].sellStockCount += stockCount - sumStock;
    return sellAtScale(stockPriceBoughtAt, stockCount, sellPositions, allTimeHigh);
};

var sellAtScale = function( stockPriceBoughtAt, stockCount, sellPositions /* []{ sellAt :x, sellPerc: .y } */, allTimeHigh ){
    if(allTimeHigh < 0){
        throw new Error("All Time High must be position. NOT " + allTimeHigh);
    }
    
    const sumOfPercentage = sellPositions.reduce((s, c, i, a) => {
        s += c.sellPerc;
        return s;
    }, 0);
    
    if(sumOfPercentage !== 1){
        throw new Error("All the percentages (.sellPerc) must add up to 1. NOT " + sumOfPercentage);
    }
    const sellState = sellPositions.map((sellPosition, i, a) => {
        return evalSellPosition(sellPosition.sellStockCount, sellPosition.sellAt, allTimeHigh);
    });
    const closedPositions = sellState.filter( state => {
        return state.didSell;
    });
    const openPositions = sellState.filter( state => {
        return !state.didSell;
    });
    const cost = stockPriceBoughtAt * stockCount;
    const closedCashState = cashState(cost, closedPositions.map(p => p.cashFromSoldStock));
    const listOfAfterTaxCashFromSoldStock = closedPositions.map(p => {
        const profitFromStock = p.sellStockAt - stockPriceBoughtAt;
        const taxWithHoldingCost = profitFromStock * TAX_RATE;
        return p.cashFromSoldStock - taxWithHoldingCost;
    });

    const afterTaxClosedCashState = cashState(cost, listOfAfterTaxCashFromSoldStock);

    return {
        sellState,
        closedPositions,
        openPositions,
        closedCashState,
        afterTaxClosedCashState,
    };
};
// x
const evalSellPosition = (sellStockCount, sellStockAt, stockPrice) => {
    console.log("evalulating : sellStockCount: %s, sellStockAt: %s, stockPrice: %s", sellStockCount, sellStockAt, stockPrice );
    if(sellStockCount <= 0){
        throw new Error( "stockCount must be position. Not " + stockCount );
    }

    if( sellStockAt <= 0 ){
        throw new Error( "the sellStockAt must be position. not " + sellStockAt);
    }

    if( stockPrice <= 0 ){
        throw new Error( "the stockPrice must be position. not " + stockPrice);
    }

    const didSell = (sellStockAt <= stockPrice);

    const stockSold = didSell ? sellStockCount : 0;
    const cashFromSoldStock =  didSell ? sellStockAt * stockSold : 0;

    return {
        didSell,
        stockSold,
        sellStockAt,
        cashFromSoldStock,
    };
};

var cashState = (cost, cashFromSoldStocks) => {
    const revenue = cashFromSoldStocks.reduce((s, cash, i, a) => {
        s += cash;
        return s;
    }, 0);

    const profit = revenue - cost; 
    const rateOfReturn = toFixed(revenue / cost, 2);

    return {
        cost,
        revenue,
        profit,
        rateOfReturn,
    };
};

var toFixed = (n, p) => {
    return +(n.toFixed(p));
};

var toJSON = (x) => {
    return JSON.stringify(x, null, 2);
};

var startTrading = () => {
    console.log("tax rate = " + TAX_RATE);
    const out = sellAtScaleByPerc(100, 5, [
        // { sellPerc: 0.3, sellAtPerc : 1.5 },
        // { sellPerc: 0.3, sellAtPerc : 2 },
        { sellPerc: 1, sellAtPerc : 3 },
    ], 1000);

    console.log(toJSON( out ));
};

startTrading();
