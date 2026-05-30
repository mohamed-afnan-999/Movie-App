import React from 'react'
import fallback_poster from "../assets/no-movie.png";

const Trending = ({ trendingMoviesList }) => {
    if (!trendingMoviesList || trendingMoviesList.length === 0)
        return null;

    return (
        <div className="wrapper">
            <section className="trending">
                <h2>Trending</h2>
                <ul>
                    {trendingMoviesList.map((movie, index) => (
                        <li key={movie.$id}>
                            <p>{ index+1 }</p>
                            <img src={movie.poster_url ? `https://image.tmdb.org/t/p/w500/${movie.poster_url}` : fallback_poster} alt={movie.title}/>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}
export default Trending
