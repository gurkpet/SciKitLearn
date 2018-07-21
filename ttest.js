//each variable contains an array of all of their test scores
var students = [
{name:'John', grades: [88, 89, 90, 91, 89]},
{name:'Paul', grades:[90, 89, 88, 91, 92]},
{name:'George', grades:[85, 81, 87, 85, 74]},
{name:'Ringo', grades:[75, 75, 75, 75, 75]}
];



//helper function that takes in an array of numbers and returns the average
var average = function(arrayOfTests) {
  var average = 0;
  arrayOfTests.forEach(function(testScore){
    average += testScore;
  });
  return average/arrayOfTests.length;
};

var getGrades = function(arrayOfStudents) {
  arrayOfStudents.forEach(function(student) {
    console.log(student.name, average(student.grades));
  });
};

getGrades(students);


//requre the ttest module which I installed with npm install ttest
var ttest = require('ttest');

var compareOneToAll = function(arrayOfStudents, indexOfOne) {
var currentTest;
  console.log(`\n\n\nComparing ${arrayOfStudents[indexOfOne].name}'s tests to the others, avg score ${average(arrayOfStudents[indexOfOne].grades)}`);
  for(var index = 0; index< arrayOfStudents.length; index++){
      currentTest = ttest(students[indexOfOne].grades, students[index].grades);
      if(indexOfOne !== index) {
        console.log(` p-value:${Math.round(currentTest.pValue()*1000000)/1000000} for ${students[index].name} tests, avg score ${average(students[index].grades)}`);
      }
  }
};

compareOneToAll(students, 0);
compareOneToAll(students, 1);
compareOneToAll(students, 2);
compareOneToAll(students, 3);
//If the p-value is less than 0.05, we reject the null hypothesis that there's
//no difference between the means and conclude that a significant difference does exist