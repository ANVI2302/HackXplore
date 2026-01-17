import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { BookOpen, Star, Clock } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  provider: string;
  difficulty_level: string;
  duration_hours: number;
  skills_covered: string[];
  rating: number;
  url: string;
}

export default function Resources() {
  const { user, token } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [recommended, setRecommended] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"all" | "recommended">("recommended");

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const [coursesData, recommendedData] = await Promise.all([
          api.getCourses(token),
          api.getRecommendedCourses(token)
        ]);
        setCourses(coursesData.courses || []);
        setRecommended(recommendedData || []);
      } catch (error) {
        console.error("Failed to fetch resources:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) return <Loader />;

  const displayCourses = tab === "recommended" ? recommended.map(r => r.course) : courses;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <BookOpen className="w-10 h-10 text-green-400" />
            Learning Resources
          </h1>
          <p className="text-gray-400">Discover curated courses and learning materials</p>
        </div>

        <div className="flex gap-4 mb-8">
          <Button 
            onClick={() => setTab("recommended")}
            className={`${tab === "recommended" ? "bg-green-600" : "bg-slate-700"} hover:opacity-90`}
          >
            Recommended for You
          </Button>
          <Button 
            onClick={() => setTab("all")}
            className={`${tab === "all" ? "bg-green-600" : "bg-slate-700"} hover:opacity-90`}
          >
            All Courses
          </Button>
        </div>

        {displayCourses.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700 p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No courses found</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCourses.map((course) => (
              <Card key={course.id} className="bg-slate-800 border-slate-700 hover:border-green-500 transition-colors p-6 flex flex-col">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-semibold text-lg flex-1">{course.title}</h3>
                    <span className={`px-3 py-1 rounded text-xs whitespace-nowrap ml-2 ${
                      course.difficulty_level === "Beginner" ? "bg-green-900 text-green-200" :
                      course.difficulty_level === "Intermediate" ? "bg-yellow-900 text-yellow-200" :
                      "bg-red-900 text-red-200"
                    }`}>
                      {course.difficulty_level}
                    </span>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-3">{course.description}</p>
                  
                  <p className="text-gray-500 text-xs mb-4">By {course.provider}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {course.skills_covered.slice(0, 2).map((skill: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined, i: Key | null | undefined) => (
                      <span key={i} className="text-xs bg-green-900 text-green-200 px-2 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-400" />
                        <span className="text-sm text-gray-400">{course.rating.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-400">{course.duration_hours}h</span>
                      </div>
                    </div>
                  </div>
                  <a href={course.url} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-green-600 hover:bg-green-700">Explore Course</Button>
                  </a>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
