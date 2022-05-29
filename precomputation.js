// node modules
const express = require('express');
const app = express();
var fs = require('fs');
app.use(express.static("public"));
var natural = require('natural');
natural.PorterStemmer.attach();

// corpus(set nCC, nCF to specify no of problems from each)
const nCC = 320;
const nCF = 920;
let N = nCC + nCF;

let keyWords = [];
let mp = [];
let keyWordsAllSet = new Set();
let keyWordsAll = [];
let tf = [];
let tf_idf = [];
let tf_idf_value = [];
let idf = [];
let tf_idf_mod = [];
let problemStatement = [];

function fetchKeyWordsArray(data){
  // Filtering only English letters ignoring rest all
  let stringWithoutLineBreaks = data.replace(/[^a-zA-Z ]/g, "");
  // Adding space to two squeezed words : RedBlue -- Red Blue
  stringWithoutLineBreaks = stringWithoutLineBreaks.replace(/([a-z])([A-Z])/g, '$1 $2');
  // Removing Extra spaces
  stringWithoutLineBreaks = stringWithoutLineBreaks.replace(/\s+/g,' ').trim();
  // Everything to lowercase
  stringWithoutLineBreaks = stringWithoutLineBreaks.toLowerCase();
  // Using Natural to remove stopwords and stemming
  return stringWithoutLineBreaks.tokenizeAndStem();
}

// -- Frequency Map Function: From array of keywords of a problem it makes frequency map
function fetchFrequencyMap(array){
  let arrayMap = new Map();
  for(let i = 0; i<array.length; i++){
    if(!isNaN(arrayMap[array[i]])){
      if(arrayMap[array[i]]){
        arrayMap[array[i]]++;
      }
      else{
        arrayMap[array[i]]=1;
      }
    }
    else{
      arrayMap[array[i]]=1;
    }
  }
  return arrayMap;
}

// -- Modulus of a vector(or array)
function modfromArray(vector){
  let mod = 0;
  for (let i = 0; i<vector.length; i++){
    mod += (vector[i]*vector[i]);
  }
  return Math.sqrt(mod);
};

// codechef
for(let i = 0; i<nCC ; i++){
    // KeywordString For the Problem i+1.. data is the returned string
    let data = fs.readFileSync('public/problems/problem'+(i+1)+'.txt', 'utf8');
    // Keywords Array
    keyWords[i] = fetchKeyWordsArray(data);
    // Frequency map of the problem i+1
    mp[i] = fetchFrequencyMap(keyWords[i]);
    // problemStatement
    let problemStatementWithoutbr = data.replace(/(\r\n|\n|\r)/gm, " ");
    problemStatement[i] = problemStatementWithoutbr.split(' ').slice(0, 35).join(' ');;

}
// codeforces
for(let i = nCC; i<N ; i++){
    // KeywordString For the Problem i+1.. data is the returned string
    let data = fs.readFileSync('public/cfproblems/cfproblem'+(i-nCC+1)+'.txt', 'utf8');
    //Keywords Array
    keyWords[i] = fetchKeyWordsArray(data);
    //Frequency map of the problem i+1
    mp[i] = fetchFrequencyMap(keyWords[i]);
    //problemStatement
    let problemStatementWithoutbr = data.replace(/(\r\n|\n|\r)/gm, " ");
    problemStatement[i] = problemStatementWithoutbr.split(' ').slice(0, 35).join(' ');
}
// Saving Problem Statements
// let problemStatementString = problemStatement.join('\n');
// fs.writeFileSync(__dirname+'/public/problem_statement_all.txt', problemStatementString);

//-- All unique Keywords inside Corpus - added from keywords of each problem in keyword Map using set
for(let i = 0; i<mp.length ; i++){
  // For iterating in array of Maps
  for (const key of Object.keys(mp[i])) {
    keyWordsAllSet.add(key);
  }
}

// Set to array
keyWordsAll = Array.from(keyWordsAllSet);

// Saving All KeyWords
// let keyWordsAll_string = keyWordsAll.join(" ");
// fs.writeFileSync(__dirname+'/public/keywordsall.txt', keyWordsAll_string);

// Inverse Document Frequency declaration and initialisation with 0 of
// size exactly equal to keyWordsAll length
for (let i=0; i<keyWordsAll.length; ++i) {
  idf[i] = 0;
}
//-- Tf and Idf for each Problem - Iterate inside keyWordsAll if the keyword
// was in freq map of problem then push its cal value in tf else push 0. ALso for idf
// if a keyword was found in problem's keyword map, inc by 1
for(let i = 0; i<N ; i++){
    tf[i] = [];
    let j = 0; // For idf count
    for (let k =0; k<keyWordsAll.length;k++) {
      let foo = mp[i][keyWordsAll[k]]
      if(!isNaN(foo)){
        if(foo){
            //tf Part
            let termFrequencyKeyWord = foo/(keyWordsAll.length);
            tf[i].push(termFrequencyKeyWord);
            //idf Part
            idf[j]= idf[j] + 1;
        }
        else{
          tf[i].push(0);
        }
      }
      else{
        tf[i].push(0);
      }
    j++;
  }
}

for(let i = 0; i<idf.length; i++){

    idf[i] = Math.log(N/idf[i]);
}
console.log("Cal of tf idf done");

for(let i = 0; i<N; i++){
  tf_idf[i] = [];
  tf_idf_value[i] = [];
  for(let j = 0; j<idf.length; j++){
    let tfidfproduct = (tf[i])[j]*(idf[j]);
    if(tfidfproduct !== 0){
      tf_idf[i].push(j.toString()+" "+tfidfproduct.toString());
      tf_idf_value[i].push(tfidfproduct);
    }
  }
}

console.log("Cal of tf*idf done");
// Saving tf_idf files
// fs.mkdirSync(__dirname+'/public/tf_idf');
// for(let i = 0; i<tf_idf.length; i++){
//   let s = tf_idf[i].join("\n");
//   fs.writeFileSync(__dirname+'/public/tf_idf/'+(i+1).toString()+'.txt', s);
//   console.log("x");
// }
// Creating Mod of tf_idf and saving them
for(let i = 0; i<tf_idf.length; i++){
  let modOftf_idf = modfromArray(tf_idf_value[i]);
  tf_idf_mod.push(modOftf_idf);
}
// Saving tf_idf_mod
// let tf_idf_mod_string = tf_idf_mod.join('\n')
// fs.writeFileSync(__dirname+'/public/tf_idf_mod.txt', tf_idf_mod_string);
console.log("Ends here");
