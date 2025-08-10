"use strict";

(async () => {

 
  const getData = url => fetch(url).then(res => {
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    return res.json();
  });

  
  const fetchCountriesByName = name => getData(`https://restcountries.com/v3.1/name/${(name)}`);

  
  const generateCountriesHTML = countries => {
    if (!countries || countries.length === 0) {
      return '<p>No countries found.</p>';
    }

    const totalCountries = countries.length;
    const totalPopulation = countries.reduce((sum, c) => sum + (c.population || 0), 0);
    const avgPopulation = Math.round(totalPopulation / totalCountries);

    const regionCounts = {};
    countries.forEach(c => {
      const region = c.region || 'Unknown';
      regionCounts[region] = (regionCounts[region] || 0) + 1;
    });

    const countriesRows = countries.map(c =>
      `<tr><td>${c.name.common}</td><td>${c.population.toLocaleString()}</td></tr>`
    ).join('');

    const regionsRows = Object.entries(regionCounts).map(([region, count]) =>
      `<tr><td>${region}</td><td>${count}</td></tr>`
    ).join('');

    return `
      <p><b>Total countries:</b> ${totalCountries}</p>
      <p><b>Total population:</b> ${totalPopulation.toLocaleString()}</p>
      <p><b>Average population:</b> ${avgPopulation.toLocaleString()}</p>

      <h3>Countries and Population</h3>
      <table>
        <thead><tr><th>Country</th><th>Population</th></tr></thead>
        <tbody>${countriesRows}</tbody>
      </table>

      <h3>Region Counts</h3>
      <table>
        <thead><tr><th>Region</th><th>Number of countries</th></tr></thead>
        <tbody>${regionsRows}</tbody>
      </table>
    `;
  };

  
  const renderHTML = (html, targetId) => document.getElementById(targetId).innerHTML = html;

  const renderCountriesHTML = html => renderHTML(html, 'results');

  

  document.getElementById('btn-search').addEventListener('click', async () => {
    const name = document.getElementById('country-input').value.trim();
    if (!name) {
      alert('Please enter a country name.');
      return;
    }
    try {
      const countries = await fetchCountriesByName(name);
      const html = generateCountriesHTML(countries);
      renderCountriesHTML(html);
    } catch (error) {
      renderCountriesHTML(`<p>Error: ${error.message}</p>`);
    }
  });

  document.getElementById('btn-all').addEventListener('click', async () => {
    try {
      
      const countries = await fetchCountriesByName('a');
      const html = generateCountriesHTML(countries);
      renderCountriesHTML(html);
    } catch (error) {
      renderCountriesHTML(`<p>Error: ${error.message}</p>`);
    }
  });

})();
