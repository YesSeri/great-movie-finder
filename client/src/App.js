import Card from './components/card'
import data from './data/data.json'
function App() {
  return (
    <div className="App">

      <Card.Container>
        {data.map(item => (
          <Card key={item.imdbID}>
            <Card.Title>
              {item.title}
            </Card.Title>
            <Card.Image src={item.poster} alt={item.title} />
            {/* <Card.Plot>
              {item.plot}
            </Card.Plot> */}
          </Card>
        ))}
      </Card.Container>

    </div>
  );
}

export default App;
