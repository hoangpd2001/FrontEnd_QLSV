import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import './SalaryChart.css';
import API from '../../api/apiConfig';
const token = localStorage.getItem('token');
const SalaryChart = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch(`${API.APIALL}user/selectCount/`,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
      const result = await response.json();
         if(result.StatusCode != 200){
          const errorMessage = await result.Message;
        throw new Error(`${errorMessage}`);
      }
      const chartData = result.Data;
      setData(chartData);
      console.log('Fetched Data:', chartData);
    } catch (error) {
       toast.error(error.message, {
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className='chart-left'>
        <div className='chart-content'>Số lượng Nhân viên </div>
        <div className="chart-text">Đã đồng bộ hóa</div>
      </div>
      <LineChart className='lineChart' width={800} height={250} data={data} >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Thang" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="SoLuong" stroke="#f08080" />
      </LineChart>
    </div>
  );
};

export default SalaryChart;
