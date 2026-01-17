import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { Users, MessageCircle, UserPlus } from "lucide-react";

interface Mentor {
  id: string;
  full_name: string;
  title?: string;
  bio?: string;
  avatar_url?: string;
  expertise_skills: string[];
  current_mentees_count: number;
}

interface Mentorship {
  id: string;
  mentor: Mentor;
  skill_focus: string;
  status: string;
  created_at: string;
}

export default function Mentorship() {
  const { user, token } = useAuth();
  const [mentors, setMentors] = useState<Mentorship[]>([]);
  const [availableMentors, setAvailableMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [skillFilter, setSkillFilter] = useState("");
  const [tab, setTab] = useState<"my" | "find">("my");

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const mentorsData = await api.getMentors(token);
        setMentors(mentorsData.mentorships || []);
      } catch (error) {
        console.error("Failed to fetch mentors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleFindMentors = async () => {
    if (!skillFilter || !token) return;
    try {
      const data = await api.getAvailableMentors(token, skillFilter);
      setAvailableMentors(data || []);
    } catch (error) {
      console.error("Failed to find mentors:", error);
    }
  };

  const handleRequestMentorship = async (mentorId: string) => {
    if (!token) return;
    try {
      await api.createMentorship(token, {
        mentor_id: mentorId,
        skill_focus: skillFilter
      });
      handleFindMentors();
    } catch (error) {
      console.error("Failed to request mentorship:", error);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Users className="w-10 h-10 text-purple-400" />
            Mentorship Network
          </h1>
          <p className="text-gray-400">Connect with mentors and grow together</p>
        </div>

        <div className="flex gap-4 mb-8">
          <Button 
            onClick={() => setTab("my")}
            className={`${tab === "my" ? "bg-purple-600" : "bg-slate-700"} hover:opacity-90`}
          >
            My Mentors
          </Button>
          <Button 
            onClick={() => setTab("find")}
            className={`${tab === "find" ? "bg-purple-600" : "bg-slate-700"} hover:opacity-90`}
          >
            Find Mentors
          </Button>
        </div>

        {tab === "my" ? (
          mentors.length === 0 ? (
            <Card className="bg-slate-800 border-slate-700 p-12 text-center">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No mentors yet. Find one to get started!</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mentors.map((m) => (
                <Card key={m.id} className="bg-slate-800 border-slate-700 p-6 hover:border-purple-500 transition-colors">
                  <div className="flex gap-4">
                    {m.mentor.avatar_url && (
                      <img src={m.mentor.avatar_url} alt={m.mentor.full_name} className="w-16 h-16 rounded-full object-cover" />
                    )}
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg">{m.mentor.full_name}</h3>
                      {m.mentor.title && <p className="text-gray-400 text-sm">{m.mentor.title}</p>}
                      <p className="text-gray-500 text-xs mt-2">Focus: <span className="text-purple-300">{m.skill_focus}</span></p>
                      <p className={`text-xs mt-2 px-2 py-1 rounded w-fit ${
                        m.status === "active" ? "bg-green-900 text-green-200" :
                        m.status === "pending" ? "bg-yellow-900 text-yellow-200" :
                        "bg-gray-700 text-gray-300"
                      }`}>
                        {m.status.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <button className="w-full mt-4 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded transition">
                    <MessageCircle className="w-4 h-4" />
                    Send Message
                  </button>
                </Card>
              ))}
            </div>
          )
        ) : (
          <div>
            <div className="flex gap-4 mb-8">
              <Input 
                placeholder="e.g., Machine Learning, Web Development..."
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
              />
              <Button onClick={handleFindMentors} className="bg-purple-600 hover:bg-purple-700">
                Search
              </Button>
            </div>

            {availableMentors.length === 0 ? (
              <Card className="bg-slate-800 border-slate-700 p-12 text-center">
                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Search for mentors in a specific skill</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableMentors.map((mentor) => (
                  <Card key={mentor.id} className="bg-slate-800 border-slate-700 p-6 hover:border-purple-500 transition-colors">
                    {mentor.avatar_url && (
                      <img src={mentor.avatar_url} alt={mentor.full_name} className="w-full h-40 object-cover rounded mb-4" />
                    )}
                    <h3 className="text-white font-semibold text-lg">{mentor.full_name}</h3>
                    {mentor.title && <p className="text-gray-400 text-sm">{mentor.title}</p>}
                    {mentor.bio && <p className="text-gray-400 text-sm mt-2 line-clamp-2">{mentor.bio}</p>}
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      {mentor.expertise_skills.slice(0, 3).map((skill, i) => (
                        <span key={i} className="text-xs bg-purple-900 text-purple-200 px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <p className="text-gray-500 text-xs mt-3">{mentor.current_mentees_count} current mentees</p>

                    <Button 
                      onClick={() => handleRequestMentorship(mentor.id)}
                      className="w-full mt-4 bg-purple-600 hover:bg-purple-700 flex items-center justify-center gap-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      Request Mentorship
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
