import React, { useEffect, useState } from 'react'
import { Container, PostCard, Skeleton } from '../components'
import databaseServices from '../appwrite/database';
import { useSelector } from 'react-redux';

function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(null);
    const [fetchError, setFetchError] = useState(false);
    const userLogin = useSelector((state) => state.auth.status);

    useEffect(() => {
        if (userLogin) {
            setLoading(true);
            databaseServices.getPosts()
                .then((posts) => {
                    if (posts) {
                        setPosts(posts.documents)
                    }
                    setLoading(false);
                })
                .catch(() => {
                    console.log("AllPosts:: getPost :: Error: ", err.message);
                    setFetchError(true);
                })
                .finally(() => setLoading(false));
        }
    }, [])


    if (!userLogin) {
        return (
            <div className='custom-h my-8 flex justify-center items-center'>
                <p className='text-xl'>Login to get posts</p>
            </div>
        )
    }

    if (fetchError) {
        return (
            <div className='custom-h my-8 flex justify-center items-center'>
                <p className='text-xl'>Error fetching posts. Please try again later.</p>
            </div>
        )
    }

    return loading ? (
        <div className='w-full sm:py-8'>
            <Container>
                <div className='custom-h grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div key={index}>
                            <Skeleton height={250} className='sm:rounded-2xl' />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    ) : (posts.length === 0) ? (
        <div className='custom-h my-8 flex justify-center items-center'>
            <p className='text-xl'>No Posts Yet!</p>
        </div>
    ) : (
        <div className='w-full sm:py-8'>
            <Container>
                <div className='custom-h grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                    {posts.map((post) => (
                        <div key={post.$id}>
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default Home