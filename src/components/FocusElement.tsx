import { FC, ReactNode, useRef } from 'react';
import { useFocus } from '../hooks/useFocus';
import { FocusObject } from '../interfaces/FocusObject';

interface FocusElementProps {
  focus?: boolean;
  focusedClassName?: string;
  className?: string;
  layer?: string;
  closest?: boolean;
  focusable?: boolean;
  style?: React.CSSProperties;
  focusableContainer?: string;
  saveLastFocused?: boolean;
  action?: FocusObject['action'];
  onFocus?: FocusObject['onFocus'];
  onBlur?: FocusObject['onBlur'];
  onDirectionKeyDown?: FocusObject['onDirectionKeyDown'];
  dangerouslySetInnerHTML?: React.DOMAttributes<HTMLDivElement>['dangerouslySetInnerHTML'];
  overwriteControl?: FocusObject['overwriteControl'];
  overflowRightHandler?: FocusObject['overflowRightHandler'];
  overflowLeftHandler?: FocusObject['overflowLeftHandler'];
  overflowUpHandler?: FocusObject['overflowUpHandler'];
  overflowDownHandler?: FocusObject['overflowDownHandler'];
  id?: FocusObject['id'];
  children: ReactNode;
}

export const FocusElement: FC<FocusElementProps> = ({
  children,
  action,
  focus,
  className,
  focusedClassName,
  layer,
  overflowRightHandler,
  overflowLeftHandler,
  overflowDownHandler,
  overflowUpHandler,
  closest,
  onFocus,
  onBlur,
  onDirectionKeyDown,
  focusable = true,
  style,
  dangerouslySetInnerHTML,
  focusableContainer,
  saveLastFocused,
  overwriteControl,
  id,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { focused } = useFocus(ref, {
    action,
    isFocused: focus,
    layer,
    overflowRightHandler,
    overflowLeftHandler,
    overflowDownHandler,
    overflowUpHandler,
    closest,
    onFocus,
    onBlur,
    onDirectionKeyDown,
    focusable,
    focusableContainer,
    saveLastFocused,
    overwriteControl,
    id,
  });

  const getClassNames = () => {
    const classNames = {
      ...(className && { [className]: true }),
      ...(focusedClassName && { [focusedClassName]: focused }),
    };

    const filtered = Object.entries(classNames).filter(([key, value]) => value);

    return filtered.map(([key, value]) => key).join(' ');
  };

  return (
    <div ref={ref} className={getClassNames()} style={style} dangerouslySetInnerHTML={dangerouslySetInnerHTML}>
      {children}
    </div>
  );
};
