const SPOTIFY_ENDPOINT = 'https://milan.swiss';
let accessToken = new URLSearchParams(window.location.search).get('access_token');

async function getCurrentlyPlaying() {
  if (!accessToken) {
    document.getElementById('spotify-info').innerHTML = '<a href="/login" class="text-blue-500">Login to Spotify</a>';
    return;
  }

  try {
    const response = await fetch(`${SPOTIFY_ENDPOINT}/currently-playing?access_token=${accessToken}`);
    if (response.status === 204) {
      document.getElementById('spotify-info').innerHTML = '<p>Not currently playing anything</p>';
      return;
    }
    const data = await response.json();

    document.getElementById('track-image').src = data.item.album.images[0].url;
    document.getElementById('track-name').textContent = data.item.name;
    document.getElementById('artist-name').textContent = data.item.artists.map(artist => artist.name).join(', ');
  } catch (error) {
    console.error('Error fetching Spotify data:', error);
    document.getElementById('spotify-info').innerHTML = '<p>Unable to fetch Spotify data</p>';
  }
}

// Update the currently playing track every 30 seconds
getCurrentlyPlaying();
setInterval(getCurrentlyPlaying, 30000);

// Bidirectional Scroll reveal effect
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      if (entry.target.id === 'skills') {
        animateSkillBars();
      }
    } else {
      entry.target.classList.remove('active');
      if (entry.target.id === 'skills') {
        resetSkillBars();
      }
    }
  });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(element => {
  observer.observe(element);
});

function animateSkillBars() {
  const skillBars = document.querySelectorAll('.skill-progress');
  skillBars.forEach(bar => {
    const width = bar.textContent;
    bar.style.width = '0%';
    setTimeout(() => {
      bar.style.width = width;
    }, 100);
  });
}

function resetSkillBars() {
  const skillBars = document.querySelectorAll('.skill-progress');
  skillBars.forEach(bar => {
    bar.style.width = '0%';
  });
}
