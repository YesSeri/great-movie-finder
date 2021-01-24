import styled from 'styled-components/macro';

export const Inner = styled.div`
`
export const Item = styled.div`
  display:flex;
  justify-content: center;
  padding: 20px 0px;
  margin: 5px 0;
  background: url('/bg.jpg')top left / cover no-repeat;
  width:100%;
  @media (max-width: 1000px){
    padding: 10px 0px;
  }
`

export const Image = styled.img`
  width: 500px;
  @media (max-width: 1000px){
    max-width: 100%;
  }
`