import { useState, useReducer } from 'react'
import { Carousel } from '../components'
import data from '../data/data.json'
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from 'react-icons/fa'
import { SectionWrapper, ImageWrapper } from './carouselStyling'

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

function CarouselContainer() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <SectionWrapper>
      <FaArrowAltCircleLeft className="left-arrow" onClick={() => dispatch({ type: 'prevMovie' })} />
      <FaArrowAltCircleRight className="right-arrow" onClick={() => dispatch({ type: 'nextMovie' })} />
      {data.map((el, idx) => (
        <div className={idx === state.current ? 'active' : 'inactive'}>
          {idx === state.current
            ? <img src={el.poster} alt="pic" />
            : null}
        </div>
      ))}
    </SectionWrapper>
    // <Carousel.Container>
    //   <Carousel>
    //     <Carousel.Actions>
    //       <Carousel.Image src={data[state.current].poster} alt={data[state.current].title} />
    //       <Carousel.PrevButton onClick={() => dispatch({ type: 'prevMovie' })} aria-label="previous slide"></Carousel.PrevButton>
    //       <Carousel.NextButton onClick={() => dispatch({ type: 'nextMovie' })} aria-label="next slide"></Carousel.NextButton>
    //     </Carousel.Actions>
    //   </Carousel>
    // </Carousel.Container>
  )
}

export default CarouselContainer;