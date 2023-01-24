import React, { useState, useEffect } from 'react';
import ThoughtList from '../components/ThoughtList';
import ThoughtForm from '../components/ThoughtForm';

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [thoughts, setThoughts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('api/users');
        const jsonData = await res.json();
        // sort the user data by created at
        const _data = jsonData.sort((a,b) => {
          return b.createdAt - a.createdAt;
        });
        setThoughts([..._data]);
        setIsLoaded(true);
      } catch(error) {
        console.log(error);
      }
    }
    fetchData();
    // dependency array is empty, so the fetch will only be invoked once the component mounts
  }, []);

  return (
    <main>
      <div className="flex-row justify-space-between">
        <div className="col-12 mb-3">
          <ThoughtForm />
        </div>
        <div className={`col-12 mb-3 `}>
          {!isLoaded ? (
            <div>Loading...</div>
          ) : (
              <ThoughtList thoughts={thoughts} setThoughts={setThoughts} title="Some Food for Thought(s)..." />
            )}
        </div>
      </div>
    </main>
  );
};

export default Home;
