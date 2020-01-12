document.addEventListener('DOMContentLoaded', getData);

async function getData() {
  try {
    const res = await fetch(
      'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
    );

    const dataset = await res.json();

    generateScatterplotGraph(dataset);
  } catch (error) {
    console.log(error);
  }
}

function generateScatterplotGraph(dataset) {
  const w = 600,
    h = 480;

  const svg = d3
    .select('#scatterplot')
    .append('svg')
    .attr('width', w)
    .attr('height', h);

  const minMinutes = d3.min(dataset, d => d.Time.substring(0, 2));
  const maxMinutes = d3.max(dataset, d => d.Time.substring(0, 2));

  const minSeconds = d3.min(dataset, d => d.Time.substring(3, 5));
  const maxSeconds = d3.max(dataset, d => d.Time.substring(3, 5));

  const minYear = d3.min(dataset, d => d.Year);
  const maxYear = d3.max(dataset, d => d.Year);

  const formatMinutes = d3.timeFormat('%M');
  const formatSeconds = d3.timeFormat('%S');

  const date = new Date();
  date.setMinutes(minMinutes);
  date.setSeconds(minSeconds);

  console.log(minMinutes, formatMinutes(date));
  console.log(minSeconds, formatSeconds(date));

  const xScale = d3
    .scaleTime()
    .domain([new Date(minYear), new Date(maxYear)])
    .range([0, w]);
}
