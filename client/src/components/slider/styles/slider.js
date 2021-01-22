import styled from 'styled-components/macro';
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from 'react-icons/fa'
import { css } from 'styled-components'

export const Container = styled.div`
  position:relative;
  display:flex;
  justify-content:center;
  align-items:center;
  max-width: 800px;
`

export const OuterContainer = styled.div`
  display:flex;
  justify-content:center;
  align-items:center;
`
const sharedButtonStyle = css`
  position: absolute;
  top: 50%;
  font-size: 3rem;
  color:white;
  z-index: 10;
  cursor:pointer;
  user-select:none;
  stroke: #333;
  stroke-width: 20;
  @media (max-width: 600px){
    font-size: 2em;
  }
`
export const PrevButton = styled(FaArrowAltCircleLeft)`
  ${sharedButtonStyle}
  left: -72px;
  stroke: #333;
  stroke-width: 20;
  @media (max-width: 600px){
    left: 12px;
  }
`
export const NextButton = styled(FaArrowAltCircleRight)`
  ${sharedButtonStyle}
  right: -72px;
  @media (max-width: 600px){
    right: 12px;
  }
`
export const Inner = styled.div`
  &.active{
    opacity: 1;
    transition-duration: 1s;
    transform: scale(1.0);
  }
  &.inactive{
    opacity: 0;
    transition-duration: 1s ease;
    transform: scale(0.95)
  }
`
export const Item = styled.div`
`
export const Image = styled.img`
  height: 600px;
  @media (max-width: 600px){
    max-width: 100%;
    height:auto;
  }
`