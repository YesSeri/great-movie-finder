import { Item, Inner, Image, Container, Actions, NextButton, PrevButton } from './styles/carousel'

export default function Carousel({ children, ...restProps }) {
  return (
    // <Item {...restProps}>
    <Inner {...restProps}>
      {children}
    </Inner>
    // </Item>
  )
}

Carousel.Image = function CarouselImage({ ...restProps }) {
  return (<Image {...restProps} />)
}
Carousel.Container = function CarouselContainer({ children, ...restProps }) {
  return (<Container {...restProps}>{children}</Container>)
}
Carousel.Actions = function CarouselActions({ children, ...restProps }) {
  return (
      <Actions {...restProps}>{children}</Actions>
  )
}
Carousel.NextButton = function CarouselNextButton({ ...restProps }) {
  return (<NextButton {...restProps}></NextButton>)
}
Carousel.PrevButton = function CarouselPrevButton({ ...restProps }) {
  return (<PrevButton {...restProps}></PrevButton>)
}