// simulate investment year
// date created: Dec 13, 2020
// author: larry battle

function simulateInvestment(startingAmount, annualPercReturns, investingYears){
    // console.log(`startingAmount: ${startingAmount}, annualPercReturns : ${annualPercReturns.join(',')}, investingYears: ${investingYears}`);
    let currentValue = startingAmount;
    
    if(investingYears < 1 || 50 < investingYears){
        throw new Error(`Investing Years much be between 1 and 50 years`);
    }

    // console.debug(`Year: ${0}, currentValue = $ ${currentValue.toLocaleString()} USD`);

    for(var i = 0; i < investingYears; i++){
        let percIncrease = annualPercReturns[0] + (Math.random() * (annualPercReturns[1] - annualPercReturns[0]));
        let incRate = (1+percIncrease);
        currentValue *= incRate;
        currentValue = ~~currentValue;
        // console.debug(`Year: ${1 + i}, incRate = ${(percIncrease * 100).toFixed(0)}%, currentValue = $ ${currentValue.toLocaleString()} USD`);
    }
    return currentValue;
}

function formatCurrency(num){
    return `$ ${num.toLocaleString()} USD`;
}

function getElementOfPercentage(values, perc){
    return values[~~(values.length * perc)];
}

function reportGuess(values, startingAmount, annualPercReturns, investingYears){
    const name = `startingAmount: ${formatCurrency(startingAmount)}, annualPercReturns : ${annualPercReturns.join(' - ')}, investingYears: ${investingYears}`;
    console.log({
        [name] : {
            "5%" : formatCurrency(getElementOfPercentage(values, 0.05)),
            "25%" : formatCurrency(getElementOfPercentage(values, 0.25)),
            "50%" : formatCurrency(getElementOfPercentage(values, 0.50)),
            "75%" : formatCurrency(getElementOfPercentage(values, 0.75)),
            "95%" : formatCurrency(getElementOfPercentage(values, 0.95))
        }
    });
}

function runSimulationForXYears(startingAmount, annualPercReturns, investingYears){
    const guesses = [];
    const runCount = 10000;
    
    for(var i = 0; i < runCount; i++){
        guesses.push(simulateInvestment( startingAmount, annualPercReturns, investingYears));
    }

    guesses.sort();

    reportGuess(guesses, startingAmount, annualPercReturns, investingYears);
}

function init(){
    runSimulationForXYears(1250, [0.05, 0.20], 5);
    runSimulationForXYears(1250, [0.05, 0.20], 10);

    runSimulationForXYears(800, [0.20, 0.50], 5);
    runSimulationForXYears(800, [0.20, 0.50], 10);


    runSimulationForXYears(1000, [0.20, 0.70], 5);
    runSimulationForXYears(1000, [0.20, 0.70], 10);

    
    runSimulationForXYears(200000, [0.30, 0.60], 3);
    runSimulationForXYears(200000, [0.30, 0.60], 5);
}
init();
