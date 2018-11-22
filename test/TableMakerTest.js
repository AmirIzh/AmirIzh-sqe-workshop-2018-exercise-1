import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
import * as TM from '../src/js/TableMaker.js';

describe('first line check', () => {
    TM.clearData();
    let parsedCode = parseCode('function func(X, Y, Z){}');
    it('function name', () => {
        TM.clearData();
        assert.equal(
            JSON.stringify(TM.getFirstLine(parsedCode['body'][0])),
            '[1,"FunctionDeclaration","func","",""]'
        );
    });

    it('function parameters', () => {
        TM.clearData();
        assert.equal(
            JSON.stringify(TM.getParams(parsedCode['body'][0]['params'])),
            '[[1,"parameter identifier","X","",""],[1,"parameter identifier","Y","",""],[1,"parameter identifier","Z","",""]]'
        );
    });
});

describe('var declaration check', () => {
    let parsedCode = parseCode('function func(){\n let x, y, z;\n let a = 5;\n}');
    it('var declaration with no assignment', () => {
        TM.clearData();
        assert.equal(
            JSON.stringify(TM.getRecData(null, parsedCode['body'][0]['body']['body'])[1]),
            '[2,"variable declaration","y","",""]'
        );
    });

    it('var declaration with assignment', () => {
        TM.clearData();
        assert.equal(
            JSON.stringify(TM.getRecData(null, parsedCode['body'][0]['body']['body'])[3]),
            '[3,"variable declaration","a","",5]'
        );
    });
});

describe('assignment expression + binary expression check', () => {
    let parsedCode = parseCode('function func(){\n let x = 5, y = 10;\n x = x + y;}');
    it('assignment of a binary exp', () => {
        TM.clearData();
        assert.equal(
            JSON.stringify(TM.getRecData(null, parsedCode['body'][0]['body']['body'])[2]),
            '[3,"assignment expression","x","","x + y"]'
        );
    });
});

describe('while expression check', () => {
    let parsedCode = parseCode('function func(){\n let x = 5, y = 10;\n while(x < y){\n x = x + 1;}}');
    it('while expression check', () => {
        TM.clearData();
        assert.equal(
            JSON.stringify(TM.getRecData(null, parsedCode['body'][0]['body']['body'])[2]),
            '[3,"while statement","","x < y",""]'
        );
    });
});

describe('if variations check', () => {
    let parsedCode = parseCode('function func(){\n let x = 5, y = 10;\n if(x > 100){\n x = y;}\n if(y < x){\n y = x;}\n else if(x = y) x = 7;\n else x = 8}');
    it('else if', () => {
        TM.clearData();
        assert.equal(
            JSON.stringify(TM.getRecData(null, parsedCode['body'][0]['body']['body'])[4]),
            '[5,"if statement","","y < x",""]'
        );
        assert.equal(
            JSON.stringify(TM.getRecData(null, parsedCode['body'][0]['body']['body'])[6]),
            '[7,"else if statement","","x = y",""]'
        );
    });
});

describe('for expression check', () => {
    let parsedCode = parseCode('function func(X){\n let x = 5;\n for(let i = 0; i < x; i++){\n x = x - 1;}}');
    it('let in for check', () => {
        TM.clearData();
        assert.equal(
            JSON.stringify(TM.getRecData(null, parsedCode['body'][0]['body']['body'])[1]),
            '[3,"variable declaration","i","",0]'
        );
    });

    it('for check', () => {
        TM.clearData();
        assert.equal(
            JSON.stringify(TM.getRecData(null, parsedCode['body'][0]['body']['body'])[2]),
            '[3,"for statement","","i < x",""]'
        );
    });
});

describe('mem exp check', () => {
    let parsedCode = parseCode('function func(X){\n let y = X[x];}');
    it('mem exp check', () => {
        TM.clearData();
        assert.equal(
            JSON.stringify(TM.getRecData(null, parsedCode['body'][0]['body']['body'])[0]),
            '[2,"variable declaration","y","","X[x]"]'
        );
    });
});


describe('ret expression + unary expression check', () => {
    let parsedCode = parseCode('function func(){\n return -1;}');
    it('ret + unary expression check', () => {
        TM.clearData();
        assert.equal(
            JSON.stringify(TM.getRecData(null, parsedCode['body'][0]['body']['body'])[0]),
            '[2,"return statement","","","-1"]'
        );
    });
});

describe('getData check', () => {
    it('getData check', () => {
        TM.clearData();
        assert.equal(
            JSON.stringify(TM.getData()),
            '[]'
        );
    });
});