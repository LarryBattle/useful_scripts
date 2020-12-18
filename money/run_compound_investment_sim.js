// simulate investment year
// date created: Dec 13, 2020
// author: larry battle
// TODO CLEAN_CODE: Refactor using OOP
// TODO CLEAN_CODE: Split the reporting and simulation into separate js libraries
// TODO NICE_TO_HAVE: Use deno 
// TODO Look into using the Intl for currency

const TAX_RATE = .3;

function createFormattedObject(o){
    const formattedObject = JSON.parse(JSON.stringify(o));

    for(let [key, value] of Object.entries(formattedObject)){
        if( (/Rate$/).test(key)){
            formattedObject[key] = +value.toFixed(2);
        }
        if( (/Percentage$/).test(key)){
            formattedObject[key] = (100 * value).toFixed(0) + '%';
        }
        if( (/Amount|Value$/).test(key)){
            formattedObject[key] = formatCurrency(value);
        }
        if( typeof value === 'object'){
            formattedObject[key] = createFormattedObject(value);
        }
    }

    return formattedObject;
}

function requirePositiveNum(name, num){
    if(!num || num < 0){
        throw new Error(`(${name}, value => ${num}) is not positive`);
    }
}

function computeTax(startingValue, currentValue, taxRate){
    requirePositiveNum("startingValue", startingValue);
    requirePositiveNum("currentValue", currentValue);
    requirePositiveNum("taxRate", taxRate);

    const diffValue = currentValue - startingValue;
    const profitValue = (0 < diffValue) ? diffValue : 0;
    const taxValue = profitValue * taxRate; 
    const afterTaxCurrentValue = currentValue - taxValue;
    const profitAfterTaxValue = profitValue * (1 - taxRate);
    const afterTaxIncreaseRate = afterTaxCurrentValue / startingValue;

    return {
        startingValue,
        currentValue,
        taxRate,
        profitValue,
        profitAfterTaxValue,
        afterTaxCurrentValue,
        taxValue,
        afterTaxIncreaseRate
    };
}

function simulateInvestmentYear(year, startingAmount, annualPercReturns, taxRate){
    let percIncrease = annualPercReturns[0] + (Math.random() * (annualPercReturns[1] - annualPercReturns[0]));
    let incRate = (1+percIncrease);
    let currentValue = startingAmount;
    currentValue *= incRate;
    currentValue = ~~currentValue;

    if(taxRate < 0 || 1 < taxRate){
        throw new Error(`Invalid tax rate : ${taxRate}`);
    }

    const taxInfo = computeTax(startingAmount, currentValue, taxRate);

    return {
        year,
        incRate,
        startingAmount,
        beforeTax: {
            cashAmount : currentValue
        },
        afterTax : taxInfo
    };
}

function simulateInvestment(startingAmount, annualPercReturns, investingYears){
    console.log(`startingAmount: ${startingAmount}, annualPercReturns : ${annualPercReturns.join(',')}, investingYears: ${investingYears}`);
    let currentValue = startingAmount;
    
    if(investingYears < 1 || 50 < investingYears){
        throw new Error(`Investing Years much be between 1 and 50 years`);
    }

    console.debug(`Year: ${0}, currentValue = $ ${currentValue.toLocaleString()} USD`);

    const yearEvents = [];

    for(var i = 0; i < investingYears; i++) {
        const event = simulateInvestmentYear(i + 1, currentValue, annualPercReturns, TAX_RATE);
        currentValue = event.afterTax.afterTaxCurrentValue;
        yearEvents.push(event);
    }
    console.debug(`currentValue: %s, metaData: %s`, formatCurrency(currentValue), JSON.stringify(yearEvents, null, 2));
    
    const formattedYearsEvents = yearEvents.map(y => createFormattedObject(y));
    console.debug(`currentValue: %s, metaData: %s`, formatCurrency(currentValue), JSON.stringify(formattedYearsEvents, null, 2));
    // TODO return yearEvents
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
    const runCount = 1;
    
    for(var i = 0; i < runCount; i++){
        guesses.push(simulateInvestment( startingAmount, annualPercReturns, investingYears));
    }

    guesses.sort();

    reportGuess(guesses, startingAmount, annualPercReturns, investingYears);
}

function init(){
    // runSimulationForXYears(2000, [0.05, 0.20], 5);

    // runSimulationForXYears(1250, [0.05, 0.20], 5);
    // runSimulationForXYears(1250, [0.05, 0.20], 10);

    runSimulationForXYears(800, [0.20, 0.50], 5);
//     runSimulationForXYears(800, [0.20, 0.50], 10);
    
    // runSimulationForXYears(200000, [0.30, 0.60], 3);
    // runSimulationForXYears(200000, [0.30, 0.60], 5);
}
init();
