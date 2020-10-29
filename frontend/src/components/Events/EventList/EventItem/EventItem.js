import React from 'react';

import './EventItem.css';

const eventItem = (props) => {
  return (
    <li key={props.key} className="event__list-item">
      {props.title}
    </li>
  );
};

export default eventItem;
