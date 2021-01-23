import { Slider } from "../components"
import data from '../data/data.json'

export default function SliderContainer() {
  return (
    <Slider>
      {data.map((el) => (
        <Slider.Image onClick={handleClick} key={el.imdbID} src={el.poster} subtitle={el.title} />
      ))}
    </Slider>
  );
}

function handleClick(){
  console.log('go to movie')
}
// Don't forget to include the css in your page

// Using webpack or parcel with a style loader
// import styles from 'react-responsive-carousel/lib/styles/carousel.min.css';

// Using html tag:
// <link rel="stylesheet" href="<NODE_MODULES_FOLDER>/react-responsive-carousel/lib/styles/carousel.min.css"/>