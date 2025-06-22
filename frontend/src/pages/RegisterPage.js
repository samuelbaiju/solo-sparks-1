import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const steps = ['Account Details', 'Personal Profile'];

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    password2: '', // For confirmation
    mood: '',
    personality_traits: '',
    emotional_needs: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(0);

  const inputStyles = "w-full px-4 py-3 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500";
  const textareaStyles = `${inputStyles} min-h-[100px]`;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleNext = () => {
    if (activeStep === 0) {
      if (formData.password !== formData.password2) {
        setError('Passwords do not match.');
        return;
      }
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long.');
        return;
      }
    }
    setError('');
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        username: formData.username,
        password: formData.password,
        profile: {
          mood: formData.mood,
          personality_traits: formData.personality_traits,
          emotional_needs: formData.emotional_needs,
        },
      };
      await axios.post('/api/register/', payload);
      navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
    } catch (err) {
      const apiError = err.response?.data?.username?.[0] || 'Registration failed. Please try again.';
      setError(apiError);
      setLoading(false);
    }
  };

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <input name="username" type="text" placeholder="Username" required className={inputStyles} value={formData.username} onChange={handleChange} />
            <input name="password" type="password" placeholder="Password (min. 8 characters)" required className={inputStyles} value={formData.password} onChange={handleChange} />
            <input name="password2" type="password" placeholder="Confirm Password" required className={inputStyles} value={formData.password2} onChange={handleChange} />
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <input name="mood" type="text" placeholder="Current Mood (e.g., curious, reflective)" className={inputStyles} value={formData.mood} onChange={handleChange} />
            <textarea name="personality_traits" placeholder="Describe your personality in a few words" className={textareaStyles} value={formData.personality_traits} onChange={handleChange}></textarea>
            <textarea name="emotional_needs" placeholder="What are your emotional needs right now?" className={textareaStyles} value={formData.emotional_needs} onChange={handleChange}></textarea>
          </div>
        );
      default:
        return 'Unknown step';
    }
  }

  return (
    <div className="w-full max-w-lg p-8 space-y-6 bg-gray-800 rounded-xl shadow-lg">
        <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Join Solo Sparks</h2>
            <p className="text-gray-400">Create your account to begin your journey.</p>
        </div>
        
        {/* Stepper */}
        <div className="flex justify-between items-center">
          {steps.map((label, index) => (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${index <= activeStep ? 'bg-green-500' : 'bg-gray-600'}`}>
                    <span className="text-white font-bold">{index + 1}</span>
                </div>
                <p className={`mt-2 text-sm ${index <= activeStep ? 'text-white' : 'text-gray-400'}`}>{label}</p>
              </div>
              {index < steps.length - 1 && <div className={`flex-auto border-t-2 transition-colors duration-300 ${index < activeStep ? 'border-green-500' : 'border-gray-600'}`}></div>}
            </React.Fragment>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="p-4 text-sm text-red-300 bg-red-900 bg-opacity-50 rounded-lg">{error}</div>}
          
          <div>{getStepContent(activeStep)}</div>

          <div className="flex justify-between pt-4">
            {activeStep !== 0 && (
              <button type="button" onClick={handleBack} className="py-2 px-4 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-md transition-colors duration-300">
                Back
              </button>
            )}

            <div className="ml-auto">
              {activeStep === steps.length - 1 ? (
                <button type="submit" disabled={loading} className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-md transition-colors duration-300 disabled:bg-gray-500">
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              ) : (
                <button type="button" onClick={handleNext} className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-md transition-colors duration-300">
                  Next
                </button>
              )}
            </div>
          </div>
        </form>
        <p className="text-sm text-center text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-green-400 hover:underline">
            Sign in
          </Link>
        </p>
    </div>
  );
}

export default RegisterPage; 