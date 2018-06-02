import React from 'react';
import { Link } from 'react-router-dom'
import { MenuItem } from 'material-ui';

export const MainMenu = (props) => {
    return <div>
      {/* app main menu items output */}
      {props.menu.map((elem) => {
          return <MenuItem key={ elem.Id } onClick={ props.handleCloseItem } leftIcon={ elem.Icon } primaryText={ elem.Title } 
            className="AppMenuItem" containerElement={ <Link to={elem.Route}/> }/> 
      })}
    </div>
};