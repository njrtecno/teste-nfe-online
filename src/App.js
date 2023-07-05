import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

export default function App() {
  const [data, setData] = useState([]);
  useEffect(() => {
    const DOMParse = new DOMParser();
    let xmlDoc;
    axios
      .get('https://nfepub.blob.core.windows.net/gabriel/feed_v1.atom', {
        'Content-Type': 'application/xml; charset=utf-8',
      })
      .then((response) => {
        xmlDoc = DOMParse.parseFromString(response.data, 'text/xml');
        
        var items = Array.from(xmlDoc.querySelectorAll('entry', 'author')).map((e) => {
           
          return {
            name: xmlDoc.querySelector('author name').textContent,
            user: xmlDoc.querySelector('author user').textContent,
            content: e.querySelector('content').textContent,
            updated: e.querySelector('updated').textContent,
            statistics: {
              replies: e
                .querySelector('statistics replies')
                .getAttribute('count'),
              retweets: e
                .querySelector('statistics retweets')
                .getAttribute('count'),
              reacts: e
                .querySelector('statistics reacts')
                .getAttribute('count'),
            },
          };
        });
        setData(items);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
      <div className="App">
        <header className="App-header">
          <h1 className="Feed-title">Tweets</h1>
        </header>
        <div className="Tweets">
          {data.slice(0, 5).map((item, index) => {
            return (                
              <div key={index}>
                <div className="Tweet">
                  <div className="Perfil-img">
                    <img src="images/MartinFowler.jpg" alt="User Image" />
                  </div>
                  <div className="User-interactions">
                    <div className="User-content">
                      <div className="User-info">
                        <span className="Name">
                          {item.name}
                        </span>
                        <span className="User">
                          @{item.user}
                        </span>
                        <span className="Time">
                          7m
                        </span>
                      </div>
                      <div className="Content" dangerouslySetInnerHTML={{ __html: item.content }}>
                      </div>
                    </div>            
                    <div className="Interactions">
                      <div className="Reply row">
                        <div className="Icon">
                          <img src="images/Reply.svg" alt="Reply" />
                        </div>
                        <div className="Count">
                          {item.statistics.replies}
                        </div>
                      </div>
                      <div className="Retweet row">
                        <div className="Icon">
                          <img src="images/Retweet.svg" alt="Retweet" />
                        </div>
                        <div className="Count">
                          {item.statistics.retweets}
                        </div>
                      </div>
                      <div className="Like row">
                        <div className="Icon">
                          <img src="images/React.svg" alt="React" />
                        </div>
                        <div className="Count">
                          {item.statistics.reacts}
                        </div>
                      </div>
                      <div className="Share row">
                        <div className="Icon">
                          <img src="images/Share.svg" alt="Share" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
  );
}
