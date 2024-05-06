import React from 'react';
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [showData, setData] = useState('');
  const [testNum, setNum] = useState(0);

  useEffect(() => {
    // 指向后端的 stream 接口
    const source = new EventSource('http://localhost:3000/stream');

    // TODO: 在这个 onMessage事件中 showData 始终是初始值了；对比click就可以，这是为啥？
    source.onmessage = ({ data }: MessageEvent) => {
      // data得到是一个字符串
      console.log('data: ', data);
      const { msg } = JSON.parse(data);
      console.log(`${showData}\n${msg}`);
      setData(`${showData}\n${msg}`);
      // setData((preData) => `${preData}<br/>${msg}`);
    };

    setTimeout(() => {
      console.log(showData);
    }, 5000);

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
