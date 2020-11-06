import React from 'react';
import { Bar as BarChart } from 'react-chartjs';

import './BookingsChart.css';

const BOOKINGS_BUCKETS = {
  Cheap: {
    min: 0,
    max: 100,
  },
  Normal: {
    min: 101,
    max: 200,
  },
  Expensive: {
    min: 201,
    max: 100000000,
  },
};

const bookingsChart = (props) => {
  const chartData = { labels: [], datasets: [] };
  let values = [];
  for (const bucket in BOOKINGS_BUCKETS) {
    const filteredBookingsCount = props.bookings.reduce((prev, current) => {
      if (
        current.event.price > BOOKINGS_BUCKETS[bucket].min &&
        current.event.price < BOOKINGS_BUCKETS[bucket].max
      ) {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);
    values.push(filteredBookingsCount);
    chartData.labels.push(bucket);
    chartData.datasets.push({
      //label: 'My First dataset',
      fillColor: 'rgba(1, 209, 209,0.2)',
      strokeColor: 'rgba(1, 209, 209,0.8)',
      highlightFill: 'rgba(220,220,220,0.75)',
      highlightStroke: 'rgba(220,220,220,1)',
      data: values,
    });
    values = [...values];
    values[values.length - 1] = 0;
  }

  return (
    <div className="barchart">
      <BarChart data={chartData} />
    </div>
  );
};

export default bookingsChart;
