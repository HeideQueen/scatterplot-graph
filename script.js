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

  const xScale = d3
    .scaleLinear()
    .domain([d3.min(dataset, d => d.Year), d3.max(dataset, d => d.Year)])
    .range([0, w]);

  const yScale = d3
    .scaleTime()
    .domain([maxTime, minTime])
    .range([h, 0]);

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'));

  const div = d3
    .select('body')
    .append('div')
    .attr('id', 'tooltip')
    .style('opacity', 0);

  const svg = d3
    .select('#scatterplot')
    .append('svg')
    .attr('width', w)
    .attr('height', h)
    .attr('overflow', 'visible');

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
    .attr('data-yvalue', d => {
      const time = new Date();
      const minutes = d.Time.substring(0, 2);
      const seconds = d.Time.substring(3, 5);
      time.setMinutes(minutes);
      time.setSeconds(seconds);
      return time;
    })
    .attr('cx', d => xScale(d.Year))
    .attr('cy', d => {
      const time = new Date();
      const minutes = d.Time.substring(0, 2);
      const seconds = d.Time.substring(3, 5);
      time.setMinutes(minutes);
      time.setSeconds(seconds);
      return yScale(time);
    })
    .attr('r', 5)
    .on('mouseover', d => {
      div
        .attr('data-year', d.Year)
        .transition()
        .duration(0)
        .style('opacity', 0.9);

      div
        .html(d.Name)
        .style('left', `${d3.event.pageX}px`)
        .style('top', `${d3.event.pageY}px`);
    })
    .on('mouseout', d => {
      div
        .transition()
        .duration(0)
        .style('opacity', 0);
    });
}
