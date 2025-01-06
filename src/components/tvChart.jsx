import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

const Chart = () => {
    const chartContainerRef = useRef(null);

    useEffect(() => {
        
        const chart = createChart(chartContainerRef.current, {
            width: 200,
            height: 100,
            layout: {
                backgroundColor: '#ffffff',
                textColor: '#000000',
            },
            grid: {
                vertLines: { color: '#e0e0e0' },
                horzLines: { color: '#e0e0e0' },
            },
        });

     
      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#4caf50', 
        downColor: '#f44336', 
        borderDownColor: '#f44336',
        borderUpColor: '#4caf50',
        wickDownColor: '#f44336',
        wickUpColor: '#4caf50',
    });

  
    candlestickSeries.setData([
        { time: '2023-01-01', open: 100, high: 105, low: 95, close: 102 },
        { time: '2023-01-02', open: 102, high: 110, low: 100, close: 108 },
        { time: '2023-01-03', open: 108, high: 115, low: 105, close: 110 },
        { time: '2023-01-04', open: 110, high: 120, low: 109, close: 118 },
        { time: '2023-01-05', open: 118, high: 125, low: 115, close: 100 },
    ]);

        
        return () => chart.remove();
    }, []);

    return <div ref={chartContainerRef} />;
};

export default Chart;
