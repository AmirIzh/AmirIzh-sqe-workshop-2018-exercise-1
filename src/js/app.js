import $ from 'jquery';
import {parseCode} from './code-analyzer';
import * as TM from './TableMaker.js';

$(document).ready(function (){
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);

        TM.getFirstLine(parsedCode['body'][0]);
        TM.getParams(parsedCode['body'][0]['params']);
        TM.getRecData(null, parsedCode['body'][0]['body']['body']);
        $('#parsedCode').append(createTable(TM.getData()));
        //$('#luli').append(JSON.stringify(TM.getRecData(null, parsedCode['body'][0]['body']['body'])));
        //$('#luli').append(JSON.stringify(parsedCode));        // to see the parsed code
    });
});

function createTable(Data){
    let table = '<tr align="center"> <b> <td> Line </td> <td> Type </td> <td> Name </td> <td> Condition </td> <td> Value </td> </b> </tr>';
    let rows = Data.length;
    let cols = 5;

    for(let i = 0; i < rows; i++){
        table += '<tr>';
        for(let j = 0; j < cols; j++){
            table += '<td>' + Data[i][j] + '</td>';
        }
        table += '</tr>';
    }

    return '<table border = 1>' + table + '</table>';
}

