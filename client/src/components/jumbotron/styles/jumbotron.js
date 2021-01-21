import styled from 'styled-components/macro';

export const Inner = styled.div`
	color: white;
	display: flex;
	flex-direction: ${({ direction }) => direction};
	width: 100%;
	max-width: 1000px;
	margin: auto;
	@media (max-width: 1000px){
		flex-direction: column;
		align-items: center;
		text-align:center;
	}
`
export const OuterBorder = styled.div`
	:not(&:last-child) {
		border-bottom: 5px solid #222;
  }
`
export const Title = styled.h1`
	margin: 0px;
	font-size:56px;
`
export const Subtitle = styled.h2`
	margin: 0px;
	font-size:24px;
	font-weight: 100;
`
export const Container = styled.div`
`

export const Pane = styled.div`
	padding: 10px 5px;
	display:flex;
	flex-wrap: wrap;
	flex: 1 1 0px;
	justify-content: center;
	align-items: center;
	@media (max-width: 1000px){
	}
`
export const Image = styled.img`

	object-fit:contain;
height: 300px;
`