import React, { useRef } from 'react';
import propTypes from 'prop-types';
import classNames from 'classnames';
import useFocus from '../hooks/useFocus';

const FocusElement = ({
  children, action, focus, className,
  focusedClassName, layer, overflowRightHandler,
}) => {
  const ref = useRef(null);
  const { focused } = useFocus(ref, {
    action,
    isFocused: focus,
    layer,
    overflowRightHandler
  });

  const elClassNames = classNames(className, {
    [focusedClassName]: focused
  });

  return (
    <div ref={ref} className={elClassNames}>
      {children}
    </div>
  );
}

FocusElement.propTypes = {
  action: propTypes.func,
  focus: propTypes.bool,
  focusedClassName: propTypes.string,
  className: propTypes.string,
  layer: propTypes.string
};

export default FocusElement;