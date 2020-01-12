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
  const w = 600;
  const h = 480;

  const minMinutes = d3.min(dataset, d => d.Time.substring(0, 2));
  const maxMinutes = d3.max(dataset, d => d.Time.substring(0, 2));

  const minSeconds = d3.min(dataset, d => d.Time.substring(3, 5));
  const maxSeconds = d3.max(dataset, d => d.Time.substring(3, 5));

  const minYear = d3.min(dataset, d => d.Year);
  const maxYear = d3.max(dataset, d => d.Year);

  const minTime = new Date();
  minTime.setMinutes(minMinutes);
  minTime.setSeconds(minSeconds);

  const maxTime = new Date();
  maxTime.setMinutes(maxMinutes);
  maxTime.setSeconds(maxSeconds);

  const minFullYear = new Date();
  minFullYear.setFullYear(minYear);

  const maxFullYear = new Date();
  maxFullYear.setFullYear(maxYear);

  const svg = d3
    .select('#scatterplot')
    .append('svg')
    .attr('width', w)
    .attr('height', h)
    .attr('overflow', 'visible');

  const xScale = d3
    .scaleTime()
    .domain([minFullYear, maxFullYear])
    .range([0, w]);

  const yScale = d3
    .scaleTime()
    .domain([minTime, maxTime])
    .range([h, 0]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'));
  svg
    .append('g')
    .attr('id', 'x-axis')
    .attr('transform', `translate(0, ${h})`)
    .call(xAxis);

  svg
    .append('g')
    .attr('id', 'y-axis')
    .attr('transform', `translate(0, 0)`)
    .call(yAxis);

  svg
    .selectAll('circle')
    .data(dataset)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('data-xvalue', d => d.Year)
    .attr('data-yvalue', d => d.Time);
}
