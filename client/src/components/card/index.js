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
  return (<Title {...restProps}>{children}</Title>)
}
Card.Image = function CardImage({ src, alt, ...restProps }) {
  return <Image src={src} alt={alt} {...restProps} />
}
Card.Container = function CardContainer({ children, ...restProps }) {
  return <Container {...restProps}>{children}</Container>
}

Card.Plot = function CardContainer({ children, ...restProps }) {
  return <Container {...restProps}>{children}</Container>
}