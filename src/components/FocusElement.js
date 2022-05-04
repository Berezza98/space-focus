import React, { useRef } from 'react';
import propTypes from 'prop-types';
import useFocus from '../hooks/useFocus';

const FocusElement = ({
  children, action, focus, className,
  focusedClassName, layer, overflowRightHandler,
  closest, onFocus, onBlur, focusable = true
}) => {
  const ref = useRef(null);
  const { focused } = useFocus(ref, {
    action,
    isFocused: focus,
    layer,
    overflowRightHandler,
    closest,
    onFocus,
    onBlur,
    focusable,
  });

  const getClassNames = () => {
    const classNames = {
      [className]: true,
      [focusedClassName]: focused
    };

    const filtered = Object.entries(classNames).filter(([key, value]) => value);

    return filtered.map(([key, value]) => key).join(' ');
  }

  return (
    <div ref={ref} className={getClassNames()}>
      {children}
    </div>
  );
}

FocusElement.propTypes = {
  action: propTypes.func,
  focus: propTypes.bool,
  focusedClassName: propTypes.string,
  className: propTypes.string,
  layer: propTypes.string,
  closest: propTypes.bool,
  onFocus: propTypes.func,
  onBlur: propTypes.func,
  focusable: propTypes.bool,
};

export default FocusElement;