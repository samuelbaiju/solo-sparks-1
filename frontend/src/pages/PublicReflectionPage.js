import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Using public axios
import { useParams, Link } from 'react-router-dom';

const PublicReflectionPage = () => {
    const { reflectionId } = useParams();
    const [reflection, setReflection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReflection = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/public-reflection/${reflectionId}/`);
                setReflection(response.data);
            } catch (err) {
                setError('This reflection could not be found or is private.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchReflection();
    }, [reflectionId]);

    const containerClasses = "w-full max-w-4xl mx-auto p-8 bg-gray-800 rounded-xl shadow-lg";

    if (loading) {
        return (
            <div className={containerClasses}>
                <p className="text-center text-gray-400">Loading Reflection...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={containerClasses + " text-center"}>
                <p className="text-red-400">{error}</p>
                <Link to="/" className="mt-4 inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
                    Back to Home
                </Link>
            </div>
        );
    }

    if (!reflection) {
        return null;
    }

    return (
        <div className={containerClasses}>
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold mb-2">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                        {reflection.quest.title}
                    </span>
                </h1>
                <p className="text-lg text-gray-400">
                    A Spark of Insight by <span className="font-bold text-white">{reflection.user.username}</span>
                </p>
                 <p className="text-sm text-gray-500 mt-1">
                    Completed on {new Date(reflection.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>
            
            {reflection.photo && (
                <div className="mb-8">
                    <img
                        src={`https://res.cloudinary.com/djzbdq8p4/${reflection.photo}`}
                        alt={`Reflection by ${reflection.user.username}`}
                        className="max-w-full mx-auto rounded-lg shadow-lg"
                    />
                </div>
            )}
            
            <div className="prose prose-invert prose-lg max-w-none">
                <p>{reflection.text_reflection}</p>
            </div>

            {reflection.audio && (
                <div className="mt-8">
                    <audio controls src={reflection.audio} className="w-full">
                        Your browser does not support the audio element.
                    </audio>
                </div>
            )}
             <div className="text-center mt-12 border-t border-gray-700 pt-6">
                <Link to="/" className="text-purple-400 hover:underline">
                    Discover your own sparks
                </Link>
            </div>
        </div>
    );
};

export default PublicReflectionPage;