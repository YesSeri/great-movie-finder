import React from 'react'
import { Inner, OuterBorder, Title, Subtitle, Image, Container, Pane } from './styles/jumbotron'

export default function Jumbotron({ children, ...restProps }) {
	return (
		<OuterBorder>
			<Inner {...restProps}>
				{children}
			</Inner>
		</OuterBorder>
	)
}

Jumbotron.Title = function JumbotronTitle({ children, ...restProps }) {
	return (<Title {...restProps}>{children}</Title>)
}
Jumbotron.Subtitle = function JumbotronSubtitle({ children, ...restProps }) {
	return (<Subtitle {...restProps}>{children}</Subtitle>)
}
Jumbotron.Image = function JumbotronImage({ src, alt, ...restProps }) {
	return <Image src={src} alt={alt} {...restProps} />
}
Jumbotron.Container = function JumbotronContainer({ children, ...restProps }) {
	return <Container {...restProps}>{children}</Container>
}
Jumbotron.Pane = function JumbotronPane({ children, ...restProps }) {
	return <Pane {...restProps}>{children}</Pane>
}