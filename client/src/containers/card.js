import { Card } from '../components'
import data from '../data/data.json'
function CardContainer() {
  return (
    <div className="App">
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

    </div>
  );
}

export default CardContainer;