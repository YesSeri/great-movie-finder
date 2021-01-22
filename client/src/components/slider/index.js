import { useReducer } from 'react'
import { Inner, Item, NextButton, PrevButton, Image, Container, OuterContainer } from './styles/slider'



function mod(x, y) { // -1 % 3 = -1 in JS. I need -1 % 3 = 2, hence the function.
  const rem = x % y;
  return rem < 0 ? rem + y : rem;
}

export default function Slider({ data, children, ...restProps }) {
  const initialState = { current: 0 };
  function reducer(state, action) {
    switch (action.type) {
      case 'nextMovie':
        return { current: mod(state.current + 1, data.length) };
      case 'prevMovie':
        return { current: mod(state.current - 1, data.length) };
      default:
        throw new Error();
    }
  }
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <Item {...restProps}>
      <PrevButton className="left-arrow" onClick={() => dispatch({ type: 'prevMovie' })} />
      <NextButton className="right-arrow" onClick={() => dispatch({ type: 'nextMovie' })} />
      {data.map((el, idx) => (
        <Inner className={idx === state.current ? 'active' : 'inactive'}>

          {idx === state.current
            ? <Image src={el.poster} />
            : null}

        </Inner>
      ))}
      {children}
    </Item>
  )
}
Slider.Container = function SliderContainer({ children, ...restProps }) {
  return (
    <OuterContainer>
      <Container>{children}</Container>
    </OuterContainer>
  )
}