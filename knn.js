const KNN = require('ml-knn');
const cTable = require('console.table');
const csv = require('csvtojson');
const prompt = require('prompt');
let knn;
const csvFilePath = './iris.csv'; // Data
const names = ['sepalLength', 'sepalWidth', 'petalLength', 'petalWidth', 'type']; // For header


let seperationSize; // To seperate training and test data

let data = [], X = [], y = [];

let trainingSetX = [], trainingSetY = [], testSetX = [], testSetY = [];

csv({noheader: false})
    .fromFile(csvFilePath)
    .on('data', (jsonObj) => {
        data.push(JSON.parse(jsonObj)); // Push each object to data Array
    })
    .on('done', (error) => {
        seperationSize = 0.8 * data.length;
        data = shuffleArray(data);
        prepData();
    });

function prepData() {

    let types = new Set(); // To gather UNIQUE classes

    data.forEach((row) => {
        types.add(row.species);
    });

    typesArray = [...types]; // To save the different types of classes.
    data.forEach((row) => {
        let rowArray, typeNumber;

        rowArray = Object.keys(row).map(key => parseFloat(row[key])).slice(0, 4);

        typeNumber = typesArray.indexOf(row.species); // Convert type(String) to type(Number)

        X.push(rowArray);
        y.push(typeNumber);
    });
    trainingSetX = X.slice(0, seperationSize);
    trainingSetY = y.slice(0, seperationSize);
    testSetX = X.slice(seperationSize);
    testSetY = y.slice(seperationSize);

    train();
}

function train() {
    knn = new KNN(trainingSetX, trainingSetY, {k: 7});

    test();
}

function test() {
    const Y_ = knn.predict(testSetX);
    const testSetLength = testSetX.length;
    const predictionError = error(Y_, testSetY);
    console.log(`Test Set Size = ${testSetLength} and number of Misclassifications = ${predictionError}`);
    console.table(confusionMatrix(Y_, testSetY));
    // predict();
}

function confusionMatrix(pred, actual) {
    let matrix = buildMatrix( Array.from(new Set(pred)).length);
    let predRow, actualCol, row;
    for(var result = 0; result < pred.length; result++) {
        predRow = pred[result];
        actualCol = actual[result];
        matrix[predRow][actualCol]++
    }
    return matrix;
}

function buildMatrix(n) {
    let array = Array.apply(null, Array(n)).map(Number.prototype.valueOf,0);
    let matrix = [];
    for(let row = 0; row < n; row++) {
        matrix.push(array.slice());
    }
    return matrix;
}

function error(predicted, expected) {
    let misclassifications = 0;
    for (var index = 0; index < predicted.length; index++) {
        if (predicted[index] !== expected[index]) {
            misclassifications++;
        }
    }
    return misclassifications;

}

function predict() {
    let temp = [];
    prompt.start();

    prompt.get(['Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width'], function (err, result) {
        if (!err) {
            for (var key in result) {
                temp.push(parseFloat(result[key]));
            }
            console.log(`With ${temp} -- type =  ${knn.predict(temp)}`);
        }
    });
}

/**
 * https://stackoverflow.com/a/12646864
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}