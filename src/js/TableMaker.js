let Data = [];
let alternate = false;

function getFirstLine(body){
    let newEntry = [];

    newEntry.push(body['loc']['start']['line']);
    newEntry.push(body['type']);
    newEntry.push(body['id']['name']);
    newEntry.push('');
    newEntry.push('');

    Data.push(newEntry);
    return newEntry;
}

function getParams(paramsInCode){
    let ans = [];
    for(let i = 0; i < paramsInCode.length; i++){
        let newEntry = [];
        newEntry.push(paramsInCode[i]['loc']['start']['line']);
        newEntry.push('parameter identifier');
        newEntry.push(paramsInCode[i]['name']);
        newEntry.push('');
        newEntry.push('');
        Data.push(newEntry);
        ans.push(newEntry);
    }
    return ans;
}

function getRecData(key, exp){
    if((exp instanceof Array)){
        if(key === 'declarations') processDeclarations(exp);
        else for(let i = 0; i < exp.length; i++)
            getRecData(key, exp[i]);
    }
    else{
        getRecDataPart2(key, exp);
    }
    return Data;
}

function getRecDataPart2(key, exp){
    if(!(typeof exp === 'string') && !(typeof exp === 'number') && !(typeof exp === 'boolean')) {
        getRecDataPart3(key, exp);
    }
}

function getRecDataPart3(key, exp){
    if(exp['type'] === 'ExpressionStatement') processExpression(exp['expression']);
    else if(exp['type'] === 'WhileStatement') processWhile(exp);
    else if(exp['type'] === 'ForStatement') processFor(exp);
    else getRecDataPart4(key, exp);
}

function getRecDataPart4(key, exp){
    if(exp['type'] === 'IfStatement') processIf(exp);
    else if(exp['type'] === 'ReturnStatement') processRet(exp);
    else for(let k in exp) getRecData(k, exp[k]);
}

function processDeclarations(exp){
    for(let i = 0; i < exp.length; i++){
        let newEntry = [];
        newEntry.push(exp[i]['loc']['start']['line']);
        newEntry.push('variable declaration');
        newEntry.push(exp[i]['id']['name']);
        newEntry.push('');

        if(exp[i]['init'] == null) newEntry.push('');
        else newEntry.push(cases(exp[i], 'init'));

        Data.push(newEntry);
    }
}

function processExpression(exp){
    let newEntry = [];

    newEntry.push(exp['loc']['start']['line']);
    newEntry.push('assignment expression');
    newEntry.push(exp['left']['name']);
    newEntry.push('');
    newEntry.push(cases(exp, 'right'));

    Data.push(newEntry);
}

function processBinExp(exp){
    let operator = exp['operator'];
    let left = cases(exp, 'left');
    let right = cases(exp, 'right');

    return '' + left + ' ' + operator + ' ' + right;
}

function processWhile(exp){
    let newEntry = [];
    newEntry.push(exp['loc']['start']['line']);
    newEntry.push('while statement');
    newEntry.push('');
    newEntry.push(cases(exp, 'test'));
    newEntry.push('');
    Data.push(newEntry);

    getRecData(null, exp['body']['body']);
}

function processIf(exp){
    let newEntry = [];
    newEntry.push(exp['loc']['start']['line']);
    if(alternate === true){
        newEntry.push('else if statement');
        alternate = false;
    }
    else newEntry.push('if statement');
    newEntry.push('');
    newEntry.push(cases(exp, 'test'));
    newEntry.push('');
    Data.push(newEntry);

    getRecData(null, exp['consequent']);
    if(exp['alternate'] != null){
        if(exp['alternate']['type'] === 'IfStatement') alternate = true;
        getRecData(null, exp['alternate']);
    }
}

function processMemExp(exp){
    let object = exp['object']['name'];
    let prop = cases(exp, 'property');

    return '' + object + '[' + prop + ']';
}

function processRet(exp){
    let newEntry = [];

    newEntry.push(exp['loc']['start']['line']);
    newEntry.push('return statement');
    newEntry.push('');
    newEntry.push('');
    newEntry.push(cases(exp, 'argument'));

    Data.push(newEntry);
}

function processUnaryExp(exp){
    let operator = exp['operator'];
    let val = cases(exp, 'argument');

    return '' + operator + '' + val;
}

function processFor(exp){
    processDeclarations(exp['init']['declarations']);

    let newEntry = [];
    newEntry.push(exp['loc']['start']['line']);
    newEntry.push('for statement');
    newEntry.push('');
    newEntry.push(cases(exp, 'test'));
    newEntry.push('');

    Data.push(newEntry);
    getRecData(null, exp['body']['body']);
}

function cases(exp, firstField){
    let ans;

    if(exp[firstField]['type'] === 'Literal') ans = exp[firstField]['value'];
    else if(exp[firstField]['type'] === 'Identifier') ans = exp[firstField]['name'];
    else if(exp[firstField]['type'] === 'UnaryExpression') ans = processUnaryExp(exp[firstField]);
    else if(exp[firstField]['type'] === 'MemberExpression') ans = processMemExp(exp[firstField]);
    else ans = processBinExp(exp[firstField]);

    return ans;
}

function clearData(){
    Data = [];
}

function getData(){
    return Data;
}

export {getFirstLine};
export {getParams};
export {getRecData};
export {clearData};
export {getData};