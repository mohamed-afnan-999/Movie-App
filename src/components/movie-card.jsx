import React from 'react';
import fallback_poster from '../assets/no-movie.png'
export const StarIcon = () => {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.29768 1.63248L10.6177 4.27248C10.7977 4.63998 11.2777 4.99248 11.6827 5.05998L14.0752 5.45748C15.6052 5.71248 15.9652 6.82248 14.8627 7.91748L13.0027 9.77748C12.6877 10.0925 12.5152 10.7 12.6127 11.135L13.1452 13.4375C13.5652 15.26 12.5977 15.965 10.9852 15.0125L8.74268 13.685C8.33768 13.445 7.67018 13.445 7.25768 13.685L5.01518 15.0125C3.41018 15.965 2.43518 15.2525 2.85518 13.4375L3.38768 11.135C3.48518 10.7 3.31268 10.0925 2.99768 9.77748L1.13768 7.91748C0.0426759 6.82248 0.395176 5.71248 1.92518 5.45748L4.31768 5.05998C4.71518 4.99248 5.19518 4.63998 5.37518 4.27248L6.69518 1.63248C7.41518 0.19998 8.58518 0.19998 9.29768 1.63248Z" fill="#FFCD1A"/>
        </svg>
    )
}

const MovieCard = ({key, movie: {title, vote_average, poster_path, release_date, original_language}}) => {
    return (
        <div className="movie-card">
            <img src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : fallback_poster} alt={title}/>
            <div key={key} className="mt-4">
                <h3>{title}</h3>
            </div>

            <div className="content">
                <div className="rating">
                    <StarIcon />
                    <p className="vote_average">{vote_average? vote_average.toFixed(1): "N/A"}</p>
                </div>
                <span>•</span>
                <p className="lang">{original_language? original_language[0].toUpperCase() + original_language[1].toLowerCase() : 'N/A'}</p>
                <span>•</span>
                <p className="year">{release_date? release_date.split('-')[0] : 'N/A'}</p>
            </div>

        </div>
    )
}
export default MovieCard
