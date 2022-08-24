import React, { useCallback,useEffect, useState } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';
import MovieForm from './components/MovieForm';

function App() {
  const [movies,setMovies]=useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error,setError] = useState(null);
  const [retryTimer,setretryTimer] = useState();
  const [check,setCheck] = useState(false)
  
  
  const fetchMoviesHandler = useCallback(async()=>
  {

      setIsLoading(true);
      setError(null);
      try{
        const response = await fetch('https://swapi.dev/api/films/');
       
        if(!response.ok) {
          throw new Error('Something went wrong! ...Retrying');
        }
        const data =await response.json();
        
       
        const transformedMovies = data.results.map((movieData)=>{
          return{
            id: movieData.episode_id,
            title: movieData.title,
            openingText: movieData.opening_crawl,
            releaseData: movieData.release_date,
          };
        });
        setMovies(transformedMovies);
        // setIsLoading(false);
     }catch(error){
      setError(error.message);
      setCheck(true);
     
      const retry_Timer = setTimeout(() => {
        fetchMoviesHandler();
      },5000)
      setretryTimer(retry_Timer)
      console.log(retry_Timer)

     }
     setIsLoading(false);
  },[]);

  useEffect(() =>{
    fetchMoviesHandler()
    console.log("ppp")
  },[fetchMoviesHandler])

  const cancelRetryHandler = () => {
    clearTimeout(retryTimer)
    setCheck(false)
  };

  // let content = <p>Found no movies.</p>

  // if(movies.length > 0){
  //   content = <MoviesList movies={movies} />;
  // }

  // if(error){
  //   content = <p>{error}</p>
  // }

  // if(isLoading){
  //   content = <p>Loading...</p>
  // }
  
  return (
    <React.Fragment>
    <MovieForm/>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
        {isLoading && <h1>Loading...</h1>}
      </section>
      <section>

       <MoviesList movies={movies} />
       {check && !isLoading && error &&(
        <p>
          {error}{""}
          <button onClick={cancelRetryHandler}>CancelRetrying</button>
        </p>

       )} 
       {!isLoading && movies.length === 0 && !error && <p>Found no movies.</p>}
       {!check && !isLoading && error && <p>Nothing to Show</p>}
       {/* {isLoading && <p>Loading...</p>} */}
       </section>
      
    </React.Fragment>
  );
}

export default App;
