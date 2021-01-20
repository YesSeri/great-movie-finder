import styled from 'styled-components/macro';

export const Inner = styled.div`
  display:flex;
  flex-direction:column;
  flex-wrap:wrap;
  align-items:center;
`
export const Image = styled.img`

`
export const Title = styled.h1`


`

export const Container = styled.div`
  display:flex;
  justify-content:center;
  @media (max-width: 800px) {
    flex-direction: column;

    align-items:center;
  }

`