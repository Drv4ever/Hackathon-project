import React, { useState } from 'react';

function ResumeInterviewApp() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setQuestions([]);
    setFeedback('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload a resume file.');
      return;
    }

    setLoading(true);
    setError('');
    setQuestions([]);
    setFeedback('');

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await fetch('http://localhost:5000/process-resume', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to process resume.');
      }

      const data = await response.json();
      setQuestions(data.questions || []);
      setFeedback(data.feedback || 'No feedback received.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-app-container">
      <h2>InterviewPro.AI</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFileChange} />
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Upload & Analyze'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-indicator">Analyzing your resume...</div>}

      {questions.length > 0 && (
        <div className="questions-list">
          <h3>Mock Interview Questions</h3>
          <ul>{questions.map((q, i) => <li key={i}>{q}</li>)}</ul>
        </div>
      )}
      {feedback && (
        <div className="feedback-section">
          <h3>Resume Feedback</h3>
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
}

export default ResumeInterviewApp;
