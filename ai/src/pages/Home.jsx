import React,  {useState, useEffect} from 'react';
import {Loader, Card, FormField} from '../components';


// render cards
const RenderCards = ({ data, title }) => {
  if (data?.length > 0) {
    return (
      data.map((post) => <Card key={post._id} {...post} />)
    );
  }
  return (
    <h2 className="mt-5 font-bold text-[#6469ff] text-xl uppercase">{title}</h2>
  );
};


const Home = () => {
  
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState(null);
  
  const [searchText, setSearchText] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState(null);

  // fetch all posts from the backend
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://ai-image-generator-4uwm.onrender.com/api/v1/post', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // lload the posts and let the newest post be on top
        const result = await response.json();
        setAllPosts(result.data.reverse());
      }

    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  };
  
  
  // called fetchPosts everytime the page loads 
  useEffect(() => {
    fetchPosts();
  }, []);

  
  // handle search functionality, filter posts based on name and prompt
  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);
    setSearchTimeout(
      // wait for 500ms before searching
      setTimeout(() => {
        const searchResult = allPosts.filter(
          (item) => item.name.toLowerCase().includes(searchText.toLowerCase()) || 
                    item.prompt.toLowerCase().includes(searchText.toLowerCase())
        );
        setSearchedResults(searchResult);
      }, 500),
    );
  };
  
  return (
    <section className='max-w-7xl mx-auto'>
        
      {/* Header */}
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">AI Generated Images</h1>
      </div>

      {/* search form */}    
      <div className="mt-16">
        <FormField
          type="text"
          name="text"
          placeholder="Search something..."
          value={searchText}
          handleChange={handleSearchChange}
        />
      </div>

      {/* generating cards */}    
      <div className="mt-10">
        
        {loading ? (
            // generating loading animation  
            <div className="flex justify-center items-center">
              <Loader />
            </div>
        ) : (
            <>
              {/* If searchText is set, indicate that the results posts are filtered*/}
              {searchText && (
                <h2 className="font-medium text-[#666e75] text-xl mb-3">
                  Showing Resuls for <span className="text-[#222328]">{searchText}</span>:
                </h2>
              )}
              
              <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
                {searchText ? (
                  // rendering filtered posts
                  <RenderCards
                    data={searchedResults}
                    title="No Search Results Found"
                  />
                ) : (
                  // rendering all posts
                  <RenderCards
                    data={allPosts}
                    title="No Posts Yet"
                  />
                )}
              </div>
            </>
        )}
      </div>
    </section>
  )
}

export default Home
