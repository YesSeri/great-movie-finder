import { Item, Inner, Image, Container, Actions, NextButton, PrevButton } from './styles/carousel'

export default function Carousel({ children, ...restProps }) {
  return (
    <Item {...restProps}>
      <Inner {...restProps}>
        {children}
      </Inner>
    </Item>
  )
}
