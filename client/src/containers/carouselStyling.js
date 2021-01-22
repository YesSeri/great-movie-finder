import styled from 'styled-components/macro';

export const ImageWrapper = styled.section`

`
export const SectionWrapper = styled.section`
  position:relative;
  display:flex;
  justify-content:center;
  align-items:center;
  padding-bottom: 20px;

  img{
    height: 700px;
    object-fit: contain;
    border-radius: 10px;
    @media (max-width: 600px){
      max-height:428px;
    }
  }
  .right-arrow{
    position: absolute;
    top: 50%;
    right: 32px;
    font-size: 3rem;
    color:red;
    z-index: 10;
    cursor:pointer;
    user-select:none;
  }
  .left-arrow{
    position: absolute;
    top: 50%;
    left: 32px;
    font-size: 3rem;
    color:red;
    z-index: 10;
    cursor:pointer;
    user-select:none;
  }
  .active{
    opacity: 1;
    transition-duration: 1s;
    transform: scale(1.0)
  }
  .inactive{
    opacity: 0;
    transition-duration: 1s ease;
    transform: scale(0.95)
  }
`
