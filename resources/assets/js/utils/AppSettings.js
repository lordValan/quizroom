import React from 'react';
import { Home as HomeIcon, Create as CreateIcon, Face as FaceIcon, TurnedIn as TurnedInIcon, Lock as LockIcon } from 'material-ui-icons';
import MainContent from '../components/App/AppContent/MainContent';
import QuizzesComponent from '../components/App/AppContent/QuizzesComponent';
import ProfileComponent from '../components/App/AppContent/ProfileComponent';
import InvitationsComponent from '../components/App/AppContent/InvitationsComponent';
import ManagementComponent from '../components/App/AppContent/ManagementComponent';

/* application name */
export const AppName = 'QuizRoom'; 

/* main application menu */
export const AppMainMenu = [
    {
        Id: 'menu_item_main',
        Title: 'Главная',
        Route: '/',
        Icon: <HomeIcon className="AppMenuItemIcon" />,
        Component: MainContent
    },
    {
        Id: 'menu_item_quizzes',
        Title: 'Тесты',
        Route: '/quizzes',
        Icon: <CreateIcon className="AppMenuItemIcon" />,
        Component: QuizzesComponent 
    },
    {
        Id: 'menu_item_invitations',
        Title: 'Приглашения',
        Route: '/invitations',
        Icon: <TurnedInIcon className="AppMenuItemIcon" />,
        Component: InvitationsComponent 
    },
    {
        Id: 'menu_item_profile',
        Title: 'Профиль',
        Route: '/profile',
        Icon: <FaceIcon className="AppMenuItemIcon" />,
        Component: ProfileComponent 
    },
    {
        Id: 'menu_item_management',
        Title: 'Управление',
        Route: '/management',
        Icon: <LockIcon className="AppMenuItemIcon" />,
        Component: ManagementComponent 
    }
]

/* main sort items menu */
export const SortItems = [
    {
        Id: 'not_sorted',
        Value: 'Не сортировать'
    },
    {
        Id: 'popular_desc',
        Value: 'Болеее популярные'
    },
    {
        Id: 'popular_asc',
        Value: 'Менее популярные'
    },
    {
        Id: 'date_desc',
        Value: 'Новые'
    },
    {
        Id: 'date_asc',
        Value: 'Старые'
    }
]