import React, { useEffect, useRef } from 'react';
import { ColorType, createChart } from 'lightweight-charts';

const Chart = () => {
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null); 
    useEffect(() => {
        
        const chart = createChart(chartContainerRef.current, {
            width: 150,
            height: 100,
            layout: {
                background: {type: ColorType.Solid, color: 
                    "transparent"
                },
                textColor: 'transparent',
            },
            grid: {
                vertLines: { color: 'transparent' },
                horzLines: { color: 'transparent' },
            },
            rightPriceScale: {
                visible: false, 
            },
            timeScale: {
                visible: false, // Removes the bottom time scale
            },
            watermark: {
                text: '', 
                color: 'rgba(0, 0, 0, 0)', 
                visible: false, 
            },
        });
        chartRef.current = chart;
     
      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#4caf50', 
        downColor: '#f44336', 
        borderDownColor: '#f44336',
        borderUpColor: '#4caf50',
        wickDownColor: '#f44336',
       
        wickUpColor: '#4caf50',
        priceScaleId: '',
    });

  
    candlestickSeries.setData([
        { time: '2023-01-01', open: 100, high: 105, low: 95, close: 102 },
        { time: '2023-01-02', open: 102, high: 110, low: 100, close: 108 },
        { time: '2023-01-03', open: 108, high: 115, low: 105, close: 110 },
        { time: '2023-01-04', open: 110, high: 120, low: 109, close: 118 },
        { time: '2023-01-05', open: 118, high: 125, low: 115, close: 114 },
       
    ]);

   
    const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
            const { width, height } = entry.contentRect;
            chart.resize(width, height);
        }
    });

    resizeObserver.observe(chartContainerRef.current);

  
    return () => {
        resizeObserver.disconnect();
        chart.remove();
    };
}, []);

    return <div className='h-full w-full  '  ref={chartContainerRef} />;
};

export default Chart;
