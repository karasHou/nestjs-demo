import React from 'react';
import { useEffect, useState, useRef } from 'react';
import './App.css';

function App() {
  const [showData, setData] = useState('');
  const [testNum, setNum] = useState(0);
  const showDataRef = useRef(showData); // 使用 useRef 保存 showData 的引用

  useEffect(() => {
    showDataRef.current = showData; // 每次 showData 更新时，更新 showDataRef 的值
  }, [showData]);

  useEffect(() => {
    console.log('executing effect');
    // 指向后端的 stream 接口
    const source = new EventSource('http://localhost:3000/stream');

    source.onmessage = ({ data }: MessageEvent) => {
      // data得到是一个字符串
      const { msg } = JSON.parse(data);
      // 可以使用 setState 函数来获取上一次的值
      setData((preData) => `${preData}<br/>${msg}`);

      // 或使用 useRef 来保存引用
      // setData(`${showDataRef.current} \n${msg}`);
    };

    // 组件卸载时的清理函数
    return () => {
      source.close();
    };
  }, []);

  const handleSetMessage = () => {
    console.log('testNum: ', testNum);
    // 这里就可以获取到上一次的值进行累加
    setNum(testNum + 10);
  };

  return (
    <div className="App">
      <h2>这里是SSE接受到的数据：</h2>
      <div dangerouslySetInnerHTML={{ __html: showData }}></div>

      {/* 测试点击 */}
      <button onClick={() => handleSetMessage()}>点我</button>
      <div>{testNum}</div>
    </div>
  );
}

export default App;
