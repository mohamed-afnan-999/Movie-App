import React, { useState, useEffect, useCallback } from 'react';
import Search from "./components/search.jsx";
import heroImage from "./assets/hero.png";
import bg from "./assets/hero-bg.png";
import Spinner from "./components/spinner.jsx";
import MovieCard from "./components/movie-card.jsx";
import Trending from "./components/trending.jsx";
import {fetchTrendingMovies, updateSearchCount} from "./appwrite.js";
import PageList from "./components/page-list.jsx";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_KEY}`
    }
};

function HeroSection() {
    const [searchTerm, setSearchTerm] = useState("");
    const [errorMsg, setErrorMsg] = useState('');
    const [movieList, setMovieList] = useState([]);

    // 1. Starts TRUE. The spinner shows instantly on page load.
    const [isLoading, setIsLoading] = useState(true);
    const [trendingMovies, setTrendingMovies] = useState([]);

    const fetchMovies = useCallback(async (query = "") => {
        // ❌ Notice: No setIsLoading(true) here anymore!
        // This function is now purely asynchronous. ESLint will ignore it.

        try {
            const endpoint = query
                ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
                : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

            const response = await fetch(endpoint, API_OPTIONS);

            if (!response.ok) {
                throw new Error("Failed to fetch movies.");
            }
            const data = await response.json();

            if (data.success === false) {
                setErrorMsg(data.status_message || 'Failed to fetch movies');
                setMovieList([]);
                return;
            }
            setMovieList(data.results || []);

            // Appwrite tracking
            if(query && data.results.length > 0) {
                await updateSearchCount(query, data.results[0]);        // passing the searchTerm and the first movie in the fetched results
            }
        } catch (error) {
            console.error(`Error fetching movies:`, error);
            setErrorMsg('Error fetching movies. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const loadTrendingMovies = useCallback(async () => {
       const movies = await fetchTrendingMovies();
       setTrendingMovies(movies);
    });

    // 2. Debounce search logic
    useEffect(() => {
        if (!searchTerm) return;

        const delayDebounceFunc = setTimeout(() => {
            // Because this is inside a setTimeout, it runs asynchronously.
            // ESLint will not flag this.
            setIsLoading(true);
            setErrorMsg('');
            fetchMovies(searchTerm);
        }, 500);

        return () => clearTimeout(delayDebounceFunc);
    }, [searchTerm, fetchMovies]);

    // 3. Initial load
    useEffect(() => {
        // isLoading is already true, so we just run the fetch.
        // Zero synchronous state updates happen here.
        fetchMovies("");
    }, [fetchMovies]);

    // Refresh trending movies list every time the list changes
    useEffect(() => {
        loadTrendingMovies();``
    }, [trendingMovies]);

    return (
        <main className="relative w-full overflow-hidden min-h-screen">
            <div className="relative z-10 items-center justify-center">

                <div className="wrapper">

                    <div className="fixed inset-0 -z-10 w-full h-full">
                        <img src={bg} alt="Hero-background" className="w-full h-full object-cover" />
                    </div>

                    <header>
                        <img src={heroImage} alt='hero-banner'/>
                        <div className="text-center mt-6">
                            <h1 className="inline-block text-4xl font-bold text-white">
                                Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle
                            </h1>
                        </div>
                        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                    </header>

                    <Trending trendingMoviesList={trendingMovies} />

                    <section className='all-movies'>
                        <h2 className="mt-[20px]">Popular</h2>
                        {isLoading ? (
                            <Spinner />
                        ) : errorMsg ? (
                            <p className='text-red-500'>{errorMsg}</p>
                        ) : (
                            <div>
                                {movieList.map((movie) => (
                                    <MovieCard key={movie.id} movie={movie} />
                                ))}
                            </div>
                        )}
                    </section>

                    <PageList />

                </div>
            </div>
        </main>
    );
}

const App = () => {
    return (
        <>
            <HeroSection />
        </>
    );
};

export default App;