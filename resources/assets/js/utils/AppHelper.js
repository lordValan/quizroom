import React from 'react';
import { CircularProgress } from 'material-ui';

export const showCircullarProgress = () => {
    return (
        <div className="CircularLoaderContainer">
            <CircularProgress size={60} thickness={7} className="CircularLoader"/>
        </div>
    )
}

export const chartTemplate = {
    backgroundColor: [
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 99, 132, 0.2)',                    
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
    ],
    borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(255,99,132,1)',                    
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
    ],
    borderWidth: 1,
    scales: {    
        yAxes: [{
                display: true,
                ticks: {
                    beginAtZero: true,
                    stepValue: 10,
                    max: 100
                }
        }]
    }
};

export const imagesUrl = "https://res.cloudinary.com/hmwb02lcs/image/upload/v1529426386/quizroom/";

export const SecsToTime = (secs) => {
    let scs = Math.floor(secs);

    let hrs = Math.floor(scs / 3600);
    scs %= 3600;

    let mnts = Math.floor(scs / 60);
    scs %= 60;

    return (hrs < 10 ? '0' : '') + hrs + ':' +
                (mnts < 10 ? '0' : '') + mnts + ':' +
                (scs < 10 ? '0' : '') + scs;
} 

export const StopLinkEvent = (e) => {
    e.preventDefault();
}

export const DefaultBirthDate = new Date('2010-12-31');

export const NewAnswerTemplate = {
    'text': 'Новый ответ',
    'is_right': false
}

export const NewQuestionTemplate = {
    'text': 'Новый вопрос',
    'extra_text': '',
    'answers': [
        Object.assign({}, NewAnswerTemplate),
        Object.assign({}, NewAnswerTemplate),
        Object.assign({}, NewAnswerTemplate),
    ]
}

export const NewQuizTemplate = {
    'name': 'Новый тест',
    'slug': 'new_test',
    'description': 'Описание нового теста',
    'private': false,
    'category_id': null,
    'questions': [
        Object.assign({}, NewQuestionTemplate)
    ],
    groups: []
}

export const RecoverSlug = (text, engToRus) => {
    let rus = "щ   ш  ч  ц  ю  я  ё  ж  ъ  ы  э  а б в г д е з и й к л м н о п р с т у ф х ь".split(/ +/g),
        eng = "shh sh ch cz yu ya yo zh _ y e a b v g d e z i j k l m n o p r s t u f x _".split(/ +/g),
        x;

    for(x = 0; x < rus.length; x++) {
        text = text.split(engToRus ? eng[x] : rus[x]).join(engToRus ? rus[x] : eng[x]);
        text = text.split(engToRus ? eng[x].toUpperCase() : rus[x].toUpperCase()).join(engToRus ? rus[x].toUpperCase() : eng[x].toUpperCase());
    }

    return text.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase().trim();  
}