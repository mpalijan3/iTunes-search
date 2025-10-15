const input = document.getElementById('searchInput');
const results = document.getElementById('results');
const message = document.getElementById('message');
const loader = document.getElementById('loader');
let timeout = null;

// Dodaj točkice loadera dinamički
loader.innerHTML = "<span></span><span></span><span></span>";

input.addEventListener('input', () => {
  clearTimeout(timeout);
  const term = input.value.trim();

  if (!term) {
    results.innerHTML = "";
    message.textContent = "";
    loader.classList.add('hidden');
    return;
  }

  timeout = setTimeout(() => search(term), 500);
});

async function search(term) {
  results.innerHTML = "";
  message.textContent = "";
  loader.classList.remove('hidden');

  try {
    const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song`);
    const textData = await response.text(); // iTunes vraća JSON kao tekst
    const data = JSON.parse(textData); // pretvori u JSON

    loader.classList.add('hidden');

    if (!data.results || data.results.length === 0) {
      message.textContent = `Nema rezultata za "${term}".`;
      return;
    }

    data.results.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.trackName} — ${item.artistName}`;
      results.appendChild(li);
    });
  } catch (err) {
    loader.classList.add('hidden');
    message.textContent = "Došlo je do greške pri dohvaćanju podataka.";
    console.error(err);
  }
}
