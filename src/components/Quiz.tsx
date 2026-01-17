import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader } from '@/components/ui/loader';
import { useToast } from '@/components/ui/use-toast';
import { quizApi } from '@/lib/api';

interface Question {
  id: string;
  text: string;
  options: string[];
  difficulty_level: string;
  skill_tested: string;
  topic: string;
}

interface QuizSession {
  id: string;
  skill_name: string;
  difficulty_level: string;
  title: string;
  status: string;
  question_count: number;
  questions: Question[];
  created_at: string;
  started_at?: string;
}

export function QuizGenerator() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [skills, setSkills] = useState<string[]>([
    'Python', 'JavaScript', 'Data Science', 'Web Development', 
    'Machine Learning', 'Cloud Computing', 'DevOps', 'Database Design'
  ]);
  
  const [selectedSkill, setSelectedSkill] = useState('');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [questionCount, setQuestionCount] = useState(10);
  const [loading, setLoading] = useState(false);

  const handleGenerateQuiz = async () => {
    if (!selectedSkill) {
      toast({
        title: 'Error',
        description: 'Please select a skill',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/v1/quizzes/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skill_name: selectedSkill,
          difficulty_level: difficulty,
          question_count: questionCount,
          config_id: `config_${selectedSkill}_${difficulty}`
        })
      });

      if (response.ok) {
        const quiz = await response.json();
        navigate(`/quiz/${quiz.id}`);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to generate quiz',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while generating quiz',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quiz Generator</h1>
        <p className="text-gray-600 mt-2">
          Test and improve your skills with personalized quizzes
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          {/* Skill Selection */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Select a Skill
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {skills.map((skill) => (
                <Button
                  key={skill}
                  variant={selectedSkill === skill ? "default" : "outline"}
                  onClick={() => setSelectedSkill(skill)}
                  className="justify-center"
                >
                  {skill}
                </Button>
              ))}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Difficulty Level
            </label>
            <div className="flex gap-3">
              {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                <Button
                  key={level}
                  variant={difficulty === level ? "default" : "outline"}
                  onClick={() => setDifficulty(level)}
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>

          {/* Question Count */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Number of Questions: {questionCount}
            </label>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerateQuiz}
            disabled={!selectedSkill || loading}
            size="lg"
            className="w-full"
          >
            {loading ? <Loader className="mr-2" /> : null}
            Generate Quiz
          </Button>
        </div>
      </Card>
    </div>
  );
}

export function QuizInterface({ quizId }: { quizId: string }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [quiz, setQuiz] = useState<QuizSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  const loadQuiz = async () => {
    try {
      const response = await fetch(`/api/v1/quizzes/${quizId}`);
      if (response.ok) {
        const quizData = await response.json();
        setQuiz(quizData);
        setStarted(quizData.status === 'in_progress');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load quiz',
      });
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = async () => {
    try {
      const response = await fetch(`/api/v1/quizzes/${quizId}/start`, {
        method: 'POST',
      });
      if (response.ok) {
        setStarted(true);
        setQuiz(await response.json());
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start quiz',
      });
    }
  };

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    setAnswers({
      ...answers,
      [questionId]: optionIndex
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (quiz?.questions?.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (Object.keys(answers).length < (quiz?.question_count || 0)) {
      toast({
        title: 'Warning',
        description: 'Please answer all questions before submitting',
      });
      return;
    }

    setSubmitting(true);
    try {
      const answersList = (quiz?.questions || []).map((q) => ({
        question_id: q.id,
        selected_option_index: answers[q.id]
      }));

      const response = await fetch(`/api/v1/quizzes/${quizId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answersList)
      });

      if (response.ok) {
        const result = await response.json();
        navigate(`/quiz-results/${quizId}`, { state: { result } });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit quiz',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  if (!quiz) return <div>Quiz not found</div>;

  if (!started) {
    return (
      <Card className="p-8 max-w-2xl mx-auto">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">{quiz.title}</h2>
          <div className="flex gap-4 justify-center">
            <Badge>{quiz.skill_name}</Badge>
            <Badge variant="outline">{quiz.difficulty_level}</Badge>
          </div>
          <p className="text-gray-600">
            {quiz.question_count} questions • ~{Math.ceil(quiz.question_count * 1.5)} minutes
          </p>
          <Button onClick={startQuiz} size="lg">
            Start Quiz
          </Button>
        </div>
      </Card>
    );
  }

  const currentQuestion = quiz.questions?.[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.question_count) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>Question {currentQuestionIndex + 1} of {quiz.question_count}</span>
          <span>{answeredCount} answered</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      {currentQuestion && (
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <Badge variant="outline" className="mb-3">
                {currentQuestion.topic}
              </Badge>
              <h3 className="text-lg font-semibold mb-4">
                {currentQuestion.text}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-2">
              {currentQuestion.options.map((option, index) => (
                <label
                  key={index}
                  className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    checked={answers[currentQuestion.id] === index}
                    onChange={() => handleAnswerSelect(currentQuestion.id, index)}
                    className="mr-3"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          variant="outline"
        >
          Previous
        </Button>

        {currentQuestionIndex === quiz.question_count - 1 ? (
          <Button
            onClick={handleSubmitQuiz}
            disabled={submitting || answeredCount < quiz.question_count}
            className="flex-1"
          >
            {submitting ? <Loader className="mr-2" /> : null}
            Submit Quiz
          </Button>
        ) : (
          <Button
            onClick={handleNextQuestion}
            className="flex-1"
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
}

export function QuizResults({ quizId, result }: { quizId: string; result: any }) {
  const navigate = useNavigate();

  const getPerformanceColor = () => {
    if (result.score >= 80) return 'text-green-600';
    if (result.score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Score Display */}
      <Card className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
        <div className={`text-6xl font-bold mb-4 ${getPerformanceColor()}`}>
          {Math.round(result.score)}%
        </div>
        <Badge size="lg" className="mb-4">
          {result.performance_summary}
        </Badge>
        <div className="text-gray-600">
          <p>Correct: {result.correct_answers} / {result.total_questions}</p>
          <p>Time: {Math.floor(result.time_taken_seconds / 60)}m {result.time_taken_seconds % 60}s</p>
        </div>
      </Card>

      {/* Performance Details */}
      <div className="grid md:grid-cols-2 gap-4">
        {result.strength_areas && result.strength_areas.length > 0 && (
          <Card className="p-6">
            <h3 className="font-bold mb-3 text-green-600">Strengths</h3>
            <ul className="space-y-2">
              {result.strength_areas.map((area: string, i: number) => (
                <li key={i} className="text-sm">✓ {area}</li>
              ))}
            </ul>
          </Card>
        )}

        {result.weak_areas && result.weak_areas.length > 0 && (
          <Card className="p-6">
            <h3 className="font-bold mb-3 text-orange-600">Areas to Improve</h3>
            <ul className="space-y-2">
              {result.weak_areas.map((area: string, i: number) => (
                <li key={i} className="text-sm">• {area}</li>
              ))}
            </ul>
          </Card>
        )}
      </div>

      {/* Next Steps */}
      <Card className="p-6">
        <h3 className="font-bold mb-3">Recommended Next Steps</h3>
        <ul className="space-y-2">
          {result.next_steps.map((step: string, i: number) => (
            <li key={i} className="text-sm flex gap-2">
              <span>→</span> {step}
            </li>
          ))}
        </ul>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => navigate('/learning')}>
          Back to Learning
        </Button>
        <Button onClick={() => navigate('/skills')}>
          View Skill Gaps
        </Button>
      </div>
    </div>
  );
}
