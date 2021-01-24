
import React, { createContext, useContext, useState, useEffect } from 'react'
import { Inner, OuterBorder, Image, Title, Subtitle, Pane } from './styles/movies'
import tempData from '../../data/movie.json'

const DataContext = createContext();

export default function Movie({ children, ...restProps }) {
  const [data, setData] = useState(null)
  useEffect(() => {
    // Fetch data here
    setTimeout(() => {
      setData(tempData)
    }, 500);
  }, [])
  return (
    data ? (
      <DataContext.Provider value={data}>
        <OuterBorder>
          <Inner {...restProps}>
            {children}
          </Inner>
        </OuterBorder>
      </DataContext.Provider>
    ) :
    null
  )
}

Movie.Title = function MovieTitle({ children, ...restProps }) {
  return (<Title {...restProps}>{children}</Title>)
}
Movie.Subtitle = function MovieSubtitle({ children, ...restProps }) {
  return (<Subtitle {...restProps}>{children}</Subtitle>)
}
Movie.Image = function MovieImage({ ...restProps }) {
  const data = useContext(DataContext)
  console.log(data)
  return <Image src={data.poster} {...restProps} /> 
}
Movie.Pane = function MoviePane({ children, ...restProps }) {
  return <Pane {...restProps}>{children}</Pane>
}