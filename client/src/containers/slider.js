import { Slider } from "../components"
import { useHistory } from "react-router-dom";
import data from '../data/data.json'

export default function SliderContainer() {
  let history = useHistory();
  function handleClick(id) {
    history.push(`/movie/${id}`);
  }
  return (
    <Slider>
      {data.map((el) => (
        <Slider.Image onClick={() => handleClick(el.imdbID)} key={el.imdbID} src={el.poster} subtitle={el.title} />
      ))}
    </Slider>
  );
}

// Don't forget to include the css in your page

// Using webpack or parcel with a style loader
// import styles from 'react-responsive-carousel/lib/styles/carousel.min.css';

// Using html tag:
// <link rel="stylesheet" href="<NODE_MODULES_FOLDER>/react-responsive-carousel/lib/styles/carousel.min.css"/>