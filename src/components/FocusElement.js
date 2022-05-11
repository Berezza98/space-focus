import React, { useRef } from 'react';
import propTypes from 'prop-types';
import useFocus from '../hooks/useFocus';
import { DIRECTION } from '../consts';

const FocusElement = ({
  children, action, focus, className,
  focusedClassName, layer, overflowRightHandler,
  closest, onFocus, onBlur, focusable = true,
  style, dangerouslySetInnerHTML, focusableContainer,
  saveLastFocused, overwriteControl, id,
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
    focusableContainer,
    saveLastFocused,
    overwriteControl,
    id,
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
    <div ref={ref} className={getClassNames()} style={style} dangerouslySetInnerHTML={dangerouslySetInnerHTML}>
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
  style: propTypes.object,
  dangerouslySetInnerHTML: propTypes.object,
  focusableContainer: propTypes.string,
  saveLastFocused: propTypes.bool,
  overwriteControl: propTypes.shape({
    [DIRECTION.UP]: propTypes.oneOfType([propTypes.string, propTypes.number]),
    [DIRECTION.DOWN]: propTypes.oneOfType([propTypes.string, propTypes.number]),
    [DIRECTION.LEFT]: propTypes.oneOfType([propTypes.string, propTypes.number]),
    [DIRECTION.RIGHT]: propTypes.oneOfType([propTypes.string, propTypes.number]),
  }),
  id: propTypes.oneOfType([propTypes.string, propTypes.number])
};

export default FocusElement;