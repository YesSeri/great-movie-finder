import { useState, useReducer } from 'react'
import { Carousel } from '../components'
import data from '../data/data.json'

const initialState = {count: 0};
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: (state.count + 1) % 3};
    case 'decrement':
      return {count: (state.count - 1) % 3};
    default:
      throw new Error();
  }
}

function CarouselContainer() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Carousel.Container>
      <Carousel>
        <h1 styled={{color: 'white'}}>{state.count}</h1>
        {/* <Carousel.Image src={data[current].poster} alt={data[current].title} /> */}
      </Carousel>
      <Carousel.PrevButton onClick={() => dispatch({type: 'decrement'})} aria-label="previous slide">Previous Slide</Carousel.PrevButton>
      <Carousel.NextButton onClick={() => dispatch({type: 'increment'})} aria-label="next slide">Next Slide</Carousel.NextButton>
    </Carousel.Container>
  )
}

export default CarouselContainer;