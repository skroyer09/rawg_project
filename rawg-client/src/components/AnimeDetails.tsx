import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import "./AnimeDetails.css";

const AnimeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [anime, setAnime] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [trailer, setTrailer] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      axios
        .get(`https://api.jikan.moe/v4/anime/${id}`)
        .then((response) => {
          setAnime(response.data.data);
          const youtubeUrl = response.data.data.trailer?.url;
          if (youtubeUrl) {
            // Extract the YouTube video ID from the URL
            const videoId = youtubeUrl.split("v=")[1].split("&")[0];
            setTrailer(`https://www.youtube.com/embed/${videoId}`); // Embed format URL
          } else {
            setTrailer(null); // No trailer available
          }
          setError(null);
        })
        .catch((error) => {
          console.error(error);
          setError("Failed to fetch anime details. Please try again later.");
        });
    }
  }, [id]);

  if (error) return <div>{error}</div>;
  if (!anime) return <div>Loading...</div>;

  return (
    <div className="animedetailsContainer">
      <button onClick={() => navigate("/")} className="backButton">
        Back to Homepage
      </button>

      <h1 className="animedetailsh1">{anime.title}</h1>
      <img className="animedetailsimg" src={anime.images.jpg.large_image_url} alt={anime.title} />
      <p className="animedetailsP">
        <strong>English Title:</strong> {anime.title_english || "N/A"}
      </p>
      <p className="animedetailsP">
        <strong>Japanese Title:</strong> {anime.title_japanese || "N/A"}
      </p>
      <p className="animedetailsP">
        <strong>Rating:</strong> {anime.rating}
      </p>
      <p className="animedetailsP">
        <strong>Genres:</strong> {anime.genres.map((genre: any) => genre.name).join(", ")}
      </p>
      <p className="animedetailsP">
        <strong>Year:</strong> {anime.year}
      </p>
      <p className="animedetailsP">
        <strong>Synopsis:</strong> {anime.synopsis}
      </p>

      <a className="animedetailsA" href={anime.url} target="_blank" rel="noopener noreferrer">
        <button className="animedetailsButton">More Info</button>
      </a>

      {/* Trailer Section */}
      {trailer ? (
        <div className="trailerSection">
          <h3>Trailer</h3>
          <iframe
            width="1120"
            height="630"
            src={trailer} // YouTube embed URL
            title="Anime Trailer"
            frameBorder="0"
            allow="fullscreen"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        <div className="trailerSection">
          <h3>Trailer</h3>
          <div className="placeholder">
            <p>No trailer available</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimeDetails;
