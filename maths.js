/*
Having fun in JavaScript whilst hopefully learning something
- christianlindeneg
*/

// Wrappers

runRegression = () => {

    // get input values
    let xPoints = document.getElementById("xValues").value;
    let yPoints = document.getElementById("yValues").value;
    let resultString;

    // run regression functions
    const result = linearRegression(xPoints, yPoints);
    if (result === false) {
        alert("An Error Occurred!\nx-values and y-values must contain the same number of values.");
        return;
    }

    // round a and b
    let a = result[0];
    let b = result[1];
    let error = Math.round(result[2]);

    // neat up result string if b is negative
    if ( b < 0) {
        resultString = `The best equation returned with ${error} error(s). That equation is:\n\nf(x) = ${a}x - ${Math.abs(b)}`;
    } else if (((b === 1 && (a === 1) && (error !== 0))) || (error > 50)) {
        resultString = `The best equation could not be determined. The best one\n\nf(x) = ${a}x + ${b}\n\nreturned with ${error} errors. That's not really useful..`;
    } else {
        resultString = `The best equation returned with ${error} error(s). That equation is:\n\nf(x) = ${a}x + ${b}`;
    }

    // check if a result is currently displayed using jQuery
    if ($("pre").hasClass("regressionResult")) {

        // if so get the element we want to remove
        let removeMe = document.getElementById("regressionResult");

        // then get the parent node and remove the child node whence we came
        removeMe.parentNode.removeChild(removeMe);
    }

    // create a new element displaying the result
    let resultParagraph = document.createElement("pre");
    resultParagraph.innerHTML = resultString;
    // label it
    resultParagraph.id = "regressionResult";
    resultParagraph.className = "regressionResult";
    // append it
    document.getElementById("regressionDiv").appendChild(resultParagraph);
};

runCeasarCipher = () => {

    // get input values
    let msg = document.getElementById("cipherMessage").value;
    let key = parseInt(document.getElementById("cipherKey").value, 10);
    let mode = document.getElementById("selectMode").value;
    const result = ceaserCipher(msg=msg, key=key, mode=mode);

    // check if a result is currently displayed using jQuery
    if ($("textarea").hasClass("cipherResult")) {

        // if so get the element we want to remove
        let removeMe = document.getElementById("cipherResult");

        // then get the parent node and remove the child node from whence we came
        removeMe.parentNode.removeChild(removeMe);
    }

    // create a new element displaying the result
    let resultParagraph = document.createElement("textarea");
    resultParagraph.innerHTML = result;
    resultParagraph.id = "cipherResult";
    resultParagraph.className = "cipherResult";
    resultParagraph.rows = 10;
    resultParagraph.cols = 60;
    document.getElementById("cipherDiv").appendChild(resultParagraph);
};

runPrimes = () => {

    // variable for result
    let result = "";
    // get input values
    let mode = document.getElementById("selectPrime").value;
    let n = parseInt(document.getElementById("primeN").value, 10);

    // find the correct mode
    if (mode === "nPrime") {
        // check if n is prime
        let nCheck = isNPrime(n);
        // format the result
        if (nCheck === true) {
            result = `Yes. ${n} is a Prime Number.`;
        } else {
            result = `No. ${n} is not a Prime Number.`;
        }

    } else if (mode === "nthPrime") {

        // find the nth prime number
        let nCheck = nthPrime(n);

        // format the result
        if (n === 1) {
            result = `The 1st Prime Number is ${nCheck}.`;
        } else if (n === 2) {
            result = `The 2nd Prime Number is ${nCheck}.`;
        } else if (n === 3) {
            result = `The 3rd Prime Number is ${nCheck}.`;
        } else {
            result = `The ${n}th Prime Number is ${nCheck}.`;
        }

    } else if (mode === "primeFactor") {
        // find the largest prime factor
        let nCheck = largestPrimeFactor(n);
        // format the result
	if (n === nCheck) {
		result = `${n} is Prime. The largest Prime Factor is itself: ${nCheck}`;
	} else {
        	result = `The Largest Prime Factor of ${n} is ${nCheck}`;
	}
    } else {
        result = `An Error Occurred.\n'${mode}' is not a valid mode.\n\nTry Again.`;
    }
    if ($("pre").hasClass("primeResult")) {
        // if so get the element we want to remove
        let removeMe = document.getElementById("primeResult");
        // then get the parent node and remove the child node whence we came
        removeMe.parentNode.removeChild(removeMe);
    }

    // create a new element displaying the result
    let resultParagraph = document.createElement("pre");
    resultParagraph.innerHTML = result;
    // label it
    resultParagraph.id = "primeResult";
    resultParagraph.className = "primeResult";
    // append it
    document.getElementById("primesDiv").appendChild(resultParagraph);
};

// Linear Regression

linearRegression = (xPoints, yPoints, range=1000) => {

    // convert input strings to arrays
    let xArray = xPoints.split(",");
    let yArray = yPoints.split(",");

    // make sure they are valid
    if (xArray.length !== yArray.length) {
        return false;
    }

    // create array of ordered pairs
    let orderedPairs = get_orderedPairs(xArray, yArray);

    // generate arrays of a and b values
    let aValues = get_aValues(range);
    let bValues = get_bValues(range);

    // create array to contain results
    let resultArray = [];

    // set worst case as default case
    let bestError = Infinity;

    // define best a and b variables
    let bestA;
    let bestB;
    // loop through generated a and b values
    // check current error against best error
    // save the a and b with lowest (best) error
    let outerLimit = 0;
    while (outerLimit < aValues.length) {
        let aCurrent = aValues[outerLimit];
		console.log(`Run #${outerLimit} out of ${aValues.length}`);
        let innerLimit = 0;
        while (innerLimit < bValues.length) {
            let bCurrent = bValues[innerLimit];
            let error = errorWrapper(aCurrent, bCurrent, orderedPairs);
            if (error === 0) {
                resultArray.push(aCurrent, bCurrent, 0);
                return resultArray;
            }
            if (error < bestError) {
                bestA = aCurrent;
                bestB = bCurrent;
                bestError = error;
            }
            innerLimit++;
        }
        outerLimit++;
    }
    resultArray.push(bestA, bestB, bestError);
    return resultArray;
};

get_yValue = (a, b, x) => {
    // returns the given y value
    let y = a * x + b;
    return y;
};

get_yDiff = (a, b, orderedPairs) => {
    // returns the difference of the calculated y and the actual y
    let xPoint = orderedPairs[0];
    let yPoint = orderedPairs[1];
    let yValue = get_yValue(a, b, xPoint)
    let yDiff = Math.abs(yPoint - yValue);
    return yDiff;
};

errorWrapper = (a, b, orderedPairs) => {
    // calculates errors for any given pair
    let errors = 0;
    for (i=0; i < orderedPairs.length; i++) {
        j = i;
        errors += get_yDiff(a, b, orderedPairs[j]);
    }
    return errors;
};

// generates a and b values to try
// range can be extended
get_aValues = range => {
    let aValues = [];
    for (i=-range; i < range; i++) {
        aValues.push(i*0.01);
    }
    return aValues;
};

get_bValues = range => {
    let bValues = [];
    for (i=-range; i < range; i++) {
        bValues.push(i*0.01);
    }
    return bValues;
};

get_orderedPairs = (xArray, yArray) => {
    // creates array of ordered pair from user input
    let orderedPairs = [];
    for (i=0; i < xArray.length; i++) {
        orderedPairs.push([xArray[i], yArray[i]]);
    }
    return orderedPairs;
};

// Ceasar Cipher

ceaserCipher = (msg, key, mode) => {
    // define characters and symbols
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const illegalSymbols = "!#$%&'()*+,-./:;<=>?@[\\]^_`{|}~\" ";

    // make user input lowercase
    let result = "";
    let msgLower = msg.toLowerCase();

    if (mode === "bruteforce") {
        // this will be the key to check
        let attempt = 1;
        while (attempt < alphabet.length) {
            for (i=0; i < msgLower.length; i++) {
                // iteriate through each character
                let currentLetter = msgLower[i];
                // make sure the character is a letter
                if ((illegalSymbols.includes(currentLetter) === false) && (alphabet.includes(currentLetter) === true)) {
                    // if so, find the new letter and append it
                    let newKey = (alphabet.indexOf(currentLetter) + attempt) % alphabet.length;
                    result += alphabet[newKey];
                } else {
                    // if it is a symbol, append it and carry on
                    result += currentLetter;
                }
            }
            keyUsed = Math.abs(alphabet.length - attempt);
            result += ` ---> KEY USED: ${keyUsed}\n\n`;
            attempt++;
        }
    } else {
        // basically the same logic as bruteforce
        // but now we actually know which key to use
        for (i=0; i < msgLower.length; i++) {
            let currentLetter = msgLower[i];
            if ((illegalSymbols.includes(currentLetter) === false) && (alphabet.includes(currentLetter) === true)) {
                if (mode === "encrypt") {
                    let fetchIndex = alphabet.indexOf(currentLetter);
                    let newIndex = (fetchIndex + key) % alphabet.length;
                    result += alphabet[newIndex];
                } else if (mode === "decrypt") {
                    let fetchIndex = alphabet.indexOf(currentLetter);
                    let newIndex = (fetchIndex - key) % alphabet.length;
                    if (newIndex < 0) {
                        newIndex = alphabet.length - Math.abs(newIndex);
                    }
                    result += alphabet[newIndex];
                } else {
                    return `An Error Occurred.\n'${mode}' is not a valid mode.\n\nTry Again.`;
                }
            } else {
                result += currentLetter;
            }
        }
    }
    return result;
};

// Primes

isNPrime = n => {
    if (n <= 1) {
        return false;
    } else if (n <= 3) {
        return true;
    } else if ((n % 2 === 0) || (n % 3 === 0)) {
        return false;
    } else {
        let i = 5;
        while (i * i <= n) {
            if ((n % i === 0) || (n % (i + 2) === 0)) {
                return false;
            }
            i += 6;
        }
        return true;
    }
};

nthPrime = n => {
    let primes = [];
    let i = 2;
    while (primes.length < n) {
        if (isNPrime(i) === false) {
            i++;
        } else {
            primes.push(i);
            i++;
        }
    }
    return primes[primes.length-1];
};

largestPrimeFactor = n => {
    let prime = 1;
    let i = 2;
    while (n > 1) {
        if (isNPrime(i) === true) {
            if (n % i === 0) {
                n /= i;
                if (i > prime) {
                    prime = i;
                } else {
                    continue;
                }
            } else {
                i++;
            }
        } else {
            i++;
        }
    }
    return prime;
};
