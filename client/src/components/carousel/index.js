import { Item, Inner, Image, Container, Actions, NextButton, PrevButton } from './styles/carousel'

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

function mod(x, y) { // -1 % 3 = -1 in JS. I need -1 % 3 = 2, hence the function.
  const rem = x % y;
  return rem < 0 ? rem + y : rem;
}

export default function Carousel({ children, ...restProps }) {
  return (
    <Item {...restProps}>
      <Inner {...restProps}>
        {children}
      </Inner>
    </Item>
  )
}
Carousel.Container = function CarouselContainer({children, ...restProps}){
  return (<Container>{children}</Container>)
}