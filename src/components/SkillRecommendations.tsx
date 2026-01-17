import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader } from '@/components/ui/loader';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';

interface SkillGap {
  skill_name: string;
  current_level: number;
  required_level: number;
  gap_level: number;
  proficiency?: string;
}

interface SkillGapAnalysis {
  user_id: string;
  total_skills_assessed: number;
  skill_gaps: SkillGap[];
  top_priority_skills: string[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  provider: string;
  difficulty_level: string;
  duration_hours: number;
  skills_covered: string[];
  rating: number;
}

interface RecommendedCourse {
  course: Course;
  relevance_score: number;
  match_reason: string;
}

export function SkillGapAnalysis() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [analysis, setAnalysis] = useState<SkillGapAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSkillGaps();
  }, []);

  const loadSkillGaps = async () => {
    try {
      const response = await fetch('/api/v1/quizzes/gaps');
      if (response.ok) {
        const data = await response.json();
        setAnalysis(data);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load skill gap analysis',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = (skill: string) => {
    navigate('/quiz-generator', { state: { selectedSkill: skill } });
  };

  if (loading) return <Loader />;

  if (!analysis || analysis.skill_gaps.length === 0) {
    return (
      <Card className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">No Skill Gaps Identified</h2>
        <p className="text-gray-600 mb-6">
          Take quizzes to identify areas for improvement
        </p>
        <Button onClick={() => navigate('/quiz-generator')}>
          Start a Quiz
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Skill Gap Analysis</h1>
        <p className="text-gray-600 mt-2">
          Based on your quiz performance, here are the skills you should focus on
        </p>
      </div>

      {/* Summary Statistics */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="text-sm text-gray-600 mb-2">Skills Assessed</div>
          <div className="text-3xl font-bold">{analysis.total_skills_assessed}</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-gray-600 mb-2">Priority Skills</div>
          <div className="text-3xl font-bold">{analysis.top_priority_skills.length}</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-gray-600 mb-2">Total Gaps</div>
          <div className="text-3xl font-bold">{analysis.skill_gaps.length}</div>
        </Card>
      </div>

      {/* Top Priority Skills */}
      {analysis.top_priority_skills.length > 0 && (
        <Card className="p-6 border-orange-200 bg-orange-50">
          <h2 className="text-xl font-bold mb-4 text-orange-900">Top Priority Skills</h2>
          <div className="flex flex-wrap gap-2">
            {analysis.top_priority_skills.map((skill) => (
              <Badge key={skill} variant="default" className="bg-orange-500">
                {skill}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Skill Gaps List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Your Skill Gaps</h2>
        
        {analysis.skill_gaps.map((gap, index) => (
          <Card key={index} className="p-6">
            <div className="space-y-4">
              {/* Skill Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{gap.skill_name}</h3>
                  <p className="text-sm text-gray-600">
                    Current Level: {gap.current_level}/10 → Required: {gap.required_level}/10
                  </p>
                </div>
                <Badge variant={gap.gap_level >= 3 ? "destructive" : "warning"}>
                  Gap: {gap.gap_level} levels
                </Badge>
              </div>

              {/* Progress Bars */}
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Current Level</span>
                    <span>{gap.current_level}/10</span>
                  </div>
                  <Progress value={(gap.current_level / 10) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Required Level</span>
                    <span>{gap.required_level}/10</span>
                  </div>
                  <Progress value={(gap.required_level / 10) * 100} className="h-2 bg-orange-100" />
                </div>
              </div>

              {/* Proficiency Badge */}
              {gap.proficiency && (
                <div>
                  <Badge variant="outline" className="text-xs">
                    {gap.proficiency}
                  </Badge>
                </div>
              )}

              {/* Action Button */}
              <Button
                onClick={() => handleStartQuiz(gap.skill_name)}
                variant="outline"
                className="w-full"
              >
                Practice {gap.skill_name}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Recommendations Link */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-blue-900">Get Recommended Courses</h3>
            <p className="text-sm text-blue-700">
              Find courses tailored to your skill gaps
            </p>
          </div>
          <Button
            onClick={() => navigate('/courses')}
            className="bg-blue-500 hover:bg-blue-600"
          >
            View Recommendations
          </Button>
        </div>
      </Card>
    </div>
  );
}

export function CourseRecommendations() {
  const { toast } = useToast();
  const [courses, setCourses] = useState<RecommendedCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium'>('all');

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      const response = await fetch('/api/v1/courses/recommendations');
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load course recommendations',
      });
    } finally {
      setLoading(false);
    }
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    return 'text-yellow-600';
  };

  const getRelevanceBg = (score: number) => {
    if (score >= 85) return 'bg-green-50';
    if (score >= 70) return 'bg-blue-50';
    return 'bg-yellow-50';
  };

  const filteredCourses = courses.filter(rec => {
    if (filter === 'high') return rec.relevance_score >= 85;
    if (filter === 'medium') return rec.relevance_score >= 70;
    return true;
  });

  if (loading) return <Loader />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Recommended Courses</h1>
        <p className="text-gray-600 mt-2">
          Personalized courses based on your skill gaps and learning goals
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        {(['all', 'high', 'medium'] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            onClick={() => setFilter(f)}
            size="sm"
          >
            {f === 'all' ? 'All Courses' : f === 'high' ? 'High Relevance' : 'Medium Relevance'}
          </Button>
        ))}
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600">No courses match your filter</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredCourses.map((rec, index) => (
            <Card key={index} className={`overflow-hidden transition-shadow hover:shadow-lg ${getRelevanceBg(rec.relevance_score)}`}>
              <div className="p-6 space-y-4">
                {/* Course Header */}
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold flex-1">{rec.course.title}</h3>
                    <div className={`text-2xl font-bold whitespace-nowrap ml-2 ${getRelevanceColor(rec.relevance_score)}`}>
                      {Math.round(rec.relevance_score)}%
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 italic mb-3">
                    {rec.match_reason}
                  </p>
                </div>

                {/* Course Details */}
                <p className="text-sm text-gray-700 line-clamp-2">
                  {rec.course.description}
                </p>

                {/* Course Info */}
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-center">
                    <div className="font-semibold">{rec.course.duration_hours}</div>
                    <div className="text-xs text-gray-600">Hours</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{rec.course.rating.toFixed(1)}</div>
                    <div className="text-xs text-gray-600">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{rec.course.difficulty_level}</div>
                    <div className="text-xs text-gray-600">Level</div>
                  </div>
                </div>

                {/* Skills Covered */}
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2">Skills Covered:</p>
                  <div className="flex flex-wrap gap-1">
                    {rec.course.skills_covered.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {rec.course.skills_covered.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{rec.course.skills_covered.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Provider */}
                <div className="text-xs text-gray-600 pt-2 border-t">
                  {rec.course.provider}
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => window.open(rec.course.url, '_blank')}
                  className="w-full"
                >
                  View Course
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Info Box */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="font-bold text-blue-900 mb-2">How We Recommend Courses</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Based on your identified skill gaps from quiz performance</li>
          <li>• Considering your current proficiency level in each skill</li>
          <li>• Prioritized by relevance to your learning goals</li>
          <li>• Including course ratings and provider credibility</li>
        </ul>
      </Card>
    </div>
  );
}

export function QuizStats() {
  const { toast } = useToast();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch('/api/v1/quizzes/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load statistics',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  if (!stats) return <div>No statistics available</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Your Quiz Statistics</h1>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="text-sm text-gray-600 mb-2">Quizzes Taken</div>
          <div className="text-3xl font-bold">{stats.total_quizzes_taken}</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-gray-600 mb-2">Average Score</div>
          <div className="text-3xl font-bold">{Math.round(stats.average_score)}%</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-gray-600 mb-2">Highest Score</div>
          <div className="text-3xl font-bold text-green-600">
            {stats.highest_score ? Math.round(stats.highest_score) : 'N/A'}%
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-gray-600 mb-2">Lowest Score</div>
          <div className="text-3xl font-bold text-orange-600">
            {stats.lowest_score ? Math.round(stats.lowest_score) : 'N/A'}%
          </div>
        </Card>
      </div>

      {/* Skills Practiced */}
      {stats.skills_practiced && stats.skills_practiced.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">Skills Practiced</h2>
          <div className="flex flex-wrap gap-2">
            {stats.skills_practiced.map((skill: string) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
