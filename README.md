# Search and Solve
## A DSA Problems Recommender
Search and Solve is a web-application,which help students to get recommendation for a curated series of problems.This application mainly recommend a list of DSA problems based on problems that a student entered.
Tech stacks used are :-1.HTML
                       2.CSS
                       3.javascript
                       4.node.js 
                       5.express 
                       6.ejs

This web-application broadly contain two sections:

### i.Engine: 
Here , a user can enter a problem in search bar to get similar ten results.On hitting enter button, it renders to another page which contain the recommended problems.

### ii.Demonstration:
In this section, detailed explaination of algorithm on which our system is based have done.

## DataSet
The problem statements from the codechef and codeforces problem sets form the data set for this recommendation engine. 

## Local Setup Guide
### Node Modules
The engine is setup on node.js and it uses three node.js packages: express, ejs and natural@2.4.5 . Natural is a node.js module used for stemming and removing stopwords.

### Steps to setup the app on local server:
1) Installing node packages - Open a command prompt window and navigate to the project folder. Type the following commands:
```
$ npm i express ejs natural@2.4.5 
```
2) Run index.js file to host app locally:
```
$ npm start index.js
```
3) That's it! App is now hosted on local server.

