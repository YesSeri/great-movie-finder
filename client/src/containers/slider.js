import { Slider } from '../components'
import data from '../data/data.json'

export default function SliderContainer() {
  return (
    <>
      <Slider.Container>
        <Slider data={data}></Slider>
      </Slider.Container>
    </>
  )
}