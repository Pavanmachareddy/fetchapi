import React, { useCallback, useEffect, useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";
import MovieForm from "./components/MovieForm";

function App(props) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryTimer, setretryTimer] = useState();
  const [check, setCheck] = useState(false);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://react-http-55193-default-rtdb.firebaseio.com/movies.json"
      );

      if (!response.ok) {
        throw new Error("Something went wrong! ...Retrying");
      }
      const data = await response.json();

      // const transformedMovies = data.results.map((movieData)=>{
      //   return{
      //     id: movieData.episode_id,
      //     title: movieData.title,
      //     openingText: movieData.opening_crawl,
      //     releaseData: movieData.release_date,
      //   };
      // });
      // setMovies(transformedMovies);
      // setIsLoading(false);

      const loadedMovies = [];
      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }
      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
      setCheck(true);

      const retry_Timer = setTimeout(() => {
        fetchMoviesHandler();
      }, 5000);
      setretryTimer(retry_Timer);
      console.log(retry_Timer);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  const cancelRetryHandler = () => {
    clearTimeout(retryTimer);
    setCheck(false);
  };

  async function onAddMovieHandler(movie) {
    const response = await fetch(
      "https://react-http-55193-default-rtdb.firebaseio.com/movies.json",
      {
        method: "POST",
        body: JSON.stringify(movie),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log(data);
  }

  const deleteMovieHandler = async (id) => {
    console.log({ id });
    await fetch(
      "https://react-http-55193-default-rtdb.firebaseio.com/movies/${id}",
      {
        method: "DELETE",
        body: JSON.stringify(movies),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    fetchMoviesHandler();
  };
  return (
    <React.Fragment>
      <MovieForm onAddMovie={onAddMovieHandler} />
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
        {isLoading && <h1>Loading...</h1>}
      </section>
      <section>
        <MoviesList movies={movies} deleteRequestApp={deleteMovieHandler} />
        {check && !isLoading && error && (
          <p>
            {error}
            {""}
            <button onClick={cancelRetryHandler}>CancelRetrying</button>
          </p>
        )}
        {!isLoading && movies.length === 0 && !error && <p>Found no movies.</p>}
        {!check && !isLoading && error && <p>Nothing to Show</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
