import { Card } from '../components'
import data from '../data/data.json'
function CardContainer() {
  return (
    <Card.Container>
      {data.map(item => (
        <Card key={item.imdbID}>
          <Card.Image src={item.poster} alt={item.title} />
          <Card.Title>
            {item.title}
          </Card.Title>
          {/* <Card.Plot>
              {item.plot}
            </Card.Plot> */}
        </Card>
      ))}
    </Card.Container>
  );
}

export default CardContainer;