import React from 'react';
import { Home as HomeIcon, Create as CreateIcon, Face as FaceIcon } from 'material-ui-icons';
import MainContent from '../components/App/AppContent/MainContent';
import QuizzesComponent from '../components/App/AppContent/QuizzesComponent';
import ProfileComponent from '../components/App/AppContent/ProfileComponent';

/* application name */
export const AppName = 'QuizRoom'; 

/* api url */
export const ApiURL = 'https://quizroom-api.herokuapp.com/api'; 

/* main application menu */
export const AppMainMenu = [
    {
        Id: 'menu_item_main',
        Title: 'Main',
        Route: '/',
        Icon: <HomeIcon className="AppMenuItemIcon" />,
        Component: MainContent
    },
    {
        Id: 'menu_item_quizzes',
        Title: 'Quizzes',
        Route: '/quizzes',
        Icon: <CreateIcon className="AppMenuItemIcon" />,
        Component: QuizzesComponent 
    },
    {
        Id: 'menu_item_profile',
        Title: 'Profile',
        Route: '/profile',
        Icon: <FaceIcon className="AppMenuItemIcon" />,
        Component: ProfileComponent 
    }
]