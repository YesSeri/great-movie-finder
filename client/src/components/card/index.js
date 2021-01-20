import React from 'react'
import { Inner, Image, Title, Container} from './styles/card'

export default function Card({ children, ...restProps }) {
  return (
    <Inner {...restProps}>
      {children}
    </Inner>
  )
}

Card.Title = function CardTitle({ children, ...restProps }) {
  return (<Title>{children}</Title>)
}
Card.Image = function cardImage({ src, alt, ...restProps }) {
  return <Image src={src} alt={alt} {...restProps} />
}
Card.Container = function cardContainer({ children, ...restProps }) {
  return <Container>{children}</Container>
}