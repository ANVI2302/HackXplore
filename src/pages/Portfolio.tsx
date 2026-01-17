import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { FolderOpen, Github, ExternalLink, ThumbsUp } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  skills_used: string[];
  github_url?: string;
  demo_url?: string;
  image_url?: string;
  endorsement_count: number;
  created_at: string;
}

export default function Portfolio() {
  const { user, token } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!token) return;

    const fetchProjects = async () => {
      try {
        const data = await api.getProjects(token);
        setProjects(data.projects || []);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [token]);

  const handleEndorse = async (projectId: string) => {
    try {
      const updated = await api.endorseProject(token!, projectId);
      setProjects(projects.map(p => p.id === projectId ? updated : p));
    } catch (error) {
      console.error("Failed to endorse project:", error);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <FolderOpen className="w-10 h-10 text-blue-400" />
              Your Portfolio
            </h1>
            <p className="text-gray-400">Showcase your best projects and work</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700">
            {showForm ? "Cancel" : "Add Project"}
          </Button>
        </div>

        {projects.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700 p-12 text-center">
            <FolderOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No projects yet. Share your work!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="bg-slate-800 border-slate-700 overflow-hidden hover:border-blue-500 transition-colors">
                {project.image_url && (
                  <img src={project.image_url} alt={project.title} className="w-full h-40 object-cover" />
                )}
                <div className="p-6">
                  <h3 className="text-white font-semibold text-xl mb-2">{project.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.skills_used.slice(0, 3).map((skill, i) => (
                      <span key={i} className="text-xs bg-blue-900 text-blue-200 px-2 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                    {project.skills_used.length > 3 && (
                      <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                        +{project.skills_used.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                    <div className="flex gap-3">
                      {project.github_url && (
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer" 
                           className="text-gray-400 hover:text-white transition">
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                      {project.demo_url && (
                        <a href={project.demo_url} target="_blank" rel="noopener noreferrer"
                           className="text-gray-400 hover:text-white transition">
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                    <button onClick={() => handleEndorse(project.id)}
                            className="flex items-center gap-2 text-sm text-gray-400 hover:text-amber-400 transition">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{project.endorsement_count}</span>
                    </button>
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
