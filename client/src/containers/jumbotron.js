import { Jumbotron } from '../components'
import data from '../components/fixtures/jumbo.json'
function CardContainer() {
  return (
    <Jumbotron.Container>
      {data.map(el => (
        <Jumbotron direction={el.direction}>
          <Jumbotron.Pane>
            <Jumbotron.Title>
              {el.title}
            </Jumbotron.Title>
            <Jumbotron.Subtitle>
              {el.subTitle}
            </Jumbotron.Subtitle>
          </Jumbotron.Pane>

          <Jumbotron.Pane>
            <Jumbotron.Image src={el.image} alt={el.alt} />
          </Jumbotron.Pane>
        </Jumbotron>
      ))}
    </Jumbotron.Container>
  );
}

export default CardContainer;