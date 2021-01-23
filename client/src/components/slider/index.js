import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Item, Image, Container, Inner, Text } from './styles/slider'
import { Carousel } from 'react-responsive-carousel';

export default function Slider({ children, ...restProps }) {
  return (
    <Container>
      <Inner>
        <Carousel infiniteLoop showStatus={false} showThumbs={false}>
          {children}
        </Carousel>
      </Inner>
    </Container>
  )
}
Slider.Image = function SliderImage({ subtitle, src, ...restProps }) {
  return (
    <Item {...restProps}>
      <Image src={src} />
      <Text className="legend">{subtitle}</Text>
    </Item>
  )
}