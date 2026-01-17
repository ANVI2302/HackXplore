import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { Trophy, Award, Star } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  badge_name: string;
  earned_at: string;
}

export default function Achievements() {
  const { user, token } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchAchievements = async () => {
      try {
        const data = await api.getAchievements(token);
        setAchievements(data.achievements || []);
      } catch (error) {
        console.error("Failed to fetch achievements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [token]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Trophy className="w-10 h-10 text-amber-400" />
            Your Achievements
          </h1>
          <p className="text-gray-400">Celebrate your milestones and badges</p>
        </div>

        {achievements.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700 p-12 text-center">
            <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No achievements yet. Keep learning to unlock badges!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className="bg-slate-800 border-slate-700 hover:border-amber-500 transition-colors p-6">
                <div className="flex items-start gap-4">
                  <Star className="w-8 h-8 text-amber-400 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg">{achievement.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{achievement.description}</p>
                    <p className="text-gray-500 text-xs mt-3">
                      {new Date(achievement.earned_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
