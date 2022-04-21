import { createRoot } from 'react-dom/client';
import initFocus from '../index';

const {
  FocusElement
} = initFocus();
const blocks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const App = () => {
  return (
    <div className="app">
      {
        blocks.map(el => <FocusElement className="block" focusedClassName="active-block"  key={el}>{el}</FocusElement>)
      }
    </div>
  )
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);