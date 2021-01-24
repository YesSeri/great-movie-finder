import React from 'react'
import { Inner, Image, Item } from './styles/header'

export default function Header({ children, ...restProps }) {
  return (
    <Item>
      <Inner {...restProps}>
        {children}
      </Inner>
    </Item>
  )
}
Header.Logo = function HeaderLogo({ ...restProps }) {
  return (
    <Image {...restProps} />
  )
}