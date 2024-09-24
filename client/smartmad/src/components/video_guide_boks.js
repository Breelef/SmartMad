import YouTube from 'react-youtube';

const YouTubeVideo = () => {
  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  const onError = (event) => {
    event.preventDefault(); // Prevent error from being printed to console
    console.log('Error occurred:', event); // Optional: log error to console instead
  };

  return (
    <div>
      <h3>YouTube Video</h3>
      <YouTube videoId="1dyjfuwrOZQ" opts={opts} onError={onError} />
    </div>
  );
};

export default YouTubeVideo;