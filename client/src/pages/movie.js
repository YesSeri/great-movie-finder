import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import localData from '../data/data.json'
function Movie() {
  const [data, setData] = useState(null)
  const { id } = useParams()
  useEffect(() => {
    setData(localData)
  }, [])
  console.log(data)
  return (
    <>
      Hello from Movie page
    </>
  );
}

export default Movie;
