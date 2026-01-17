import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Save, Loader2, Zap, AlertCircle, User } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function Profile() {
    const navigate = useNavigate()
    const { toast } = useToast()

    // Mock user data
    const mockUser = {
        name: "John Doe",
        email: "john@example.com",
        title: "Software Engineer",
        skills: ["React", "Node.js", "Python"],
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
    }

    const [name, setName] = useState(mockUser.name)
    const [title, setTitle] = useState(mockUser.title)
    const [skills, setSkills] = useState<string[]>(mockUser.skills)
    const [newSkill, setNewSkill] = useState("")
    const [isSaving, setIsSaving] = useState(false)

    const suggestedSkills = getSuggestedSkills(title).filter(s => !skills.includes(s));

    const handleSave = async () => {
        setIsSaving(true)
        try {
            // Mock save - just show success message
            setTimeout(() => {
                toast({
                    title: "Success",
                    description: "Profile saved successfully!",
                })
                setIsSaving(false)
                navigate('/dashboard')
            }, 1000)
        } catch (error) {
            console.error("Save failed", error)
            toast({
                title: "Error",
                description: "Could not save profile. Please try again.",
                variant: "destructive"
            })
            setIsSaving(false)
        }
    }

    const addSkill = () => {
        if (newSkill && !skills.includes(newSkill)) {
            setSkills([...skills, newSkill])
            setNewSkill("")
        }
    }

    const removeSkill = (skillToRemove: string) => {
        setSkills(skills.filter(s => s !== skillToRemove))
    }

    return (
        <div className="container max-w-screen-2xl p-6 lg:p-12 space-y-8">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-cyan-700 pb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Your Profile</h2>
                    <p className="text-cyan-200 text-sm">
                        Manage your profile information
                    </p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold h-10 px-6"
                >
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    {isSaving ? "Saving..." : "Save Changes"}
                </Button>
            </div>

            {skills.length === 0 && (
                <div className="bg-blue-500/10 border border-blue-500/20 text-blue-300 p-4 rounded-lg flex items-center gap-3">
                    <AlertCircle className="h-5 w-5" />
                    <div className="text-sm">
                        <strong>Tip:</strong> Add at least one skill to your profile.
                    </div>
                </div>
            )}

            <div className="grid gap-8 md:grid-cols-7">
                {/* Left Column: Personal Info */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="bg-blue-800/50 border-cyan-700">
                        <CardHeader className="bg-blue-700/50 border-b border-cyan-700">
                            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-cyan-100">
                                <User className="h-4 w-4" /> Personal Info
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="flex justify-center">
                                <div className="relative h-28 w-28 rounded-full bg-blue-700 border border-cyan-600 flex items-center justify-center overflow-hidden">
                                    <img src={mockUser.avatar} alt={mockUser.name} className="w-full h-full object-cover" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium text-cyan-100">Full Name</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="bg-blue-700 border-cyan-600 text-white h-10 focus:border-cyan-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-sm font-medium text-cyan-100">Job Title</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Software Engineer"
                                    className="bg-blue-700 border-cyan-600 text-white h-10 focus:border-cyan-500"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Skills */}
                <div className="md:col-span-5">
                    <Card className="bg-blue-800/50 border-cyan-700">
                        <CardHeader className="bg-blue-700/50 border-b border-cyan-700">
                            <CardTitle className="text-lg font-semibold text-white">Skills & Expertise</CardTitle>
                            <CardDescription className="text-cyan-200 text-sm">Add the skills you want to showcase</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {/* Current Skills */}
                            <div className="mb-6">
                                <Label className="text-sm font-medium text-cyan-100 block mb-3">Your Skills</Label>
                                <div className="flex flex-wrap gap-2 mb-4 p-4 bg-blue-700/30 rounded-lg min-h-[50px]">
                                    {skills.length === 0 ? (
                                        <p className="text-cyan-300 text-sm">No skills added yet</p>
                                    ) : (
                                        skills.map((skill) => (
                                            <Badge key={skill} variant="secondary" className="bg-cyan-600 text-white hover:bg-cyan-700 px-3 py-1.5">
                                                {skill}
                                                <span
                                                    onClick={() => removeSkill(skill)}
                                                    className="ml-2 cursor-pointer hover:text-red-300"
                                                >
                                                    ×
                                                </span>
                                            </Badge>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Add Skill Input */}
                            <div className="space-y-3">
                                <Label className="text-sm font-medium text-cyan-100">Add a Skill</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                                        placeholder="e.g. React, Python, Project Management"
                                        className="flex-1 bg-blue-700 border-cyan-600 text-white h-10 focus:border-cyan-500"
                                    />
                                    <Button onClick={addSkill} className="bg-cyan-600 hover:bg-cyan-700 text-white h-10 px-4">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Suggested Skills */}
                            {suggestedSkills.length > 0 && (
                                <div className="mt-6 p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                                    <Label className="text-sm font-medium text-cyan-300 block mb-3">
                                        <Zap className="h-4 w-4 inline mr-2" /> Recommended Skills
                                    </Label>
                                    <div className="flex flex-wrap gap-2">
                                        {suggestedSkills.slice(0, 5).map(skill => (
                                            <Badge
                                                key={skill}
                                                variant="outline"
                                                onClick={() => {
                                                    if (!skills.includes(skill)) {
                                                        setSkills([...skills, skill]);
                                                    }
                                                }}
                                                className="cursor-pointer border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20"
                                            >
                                                + {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function getSuggestedSkills(currentTitle: string): string[] {
    const t = currentTitle.toLowerCase();
    if (t.includes('bio') || t.includes('gene')) return ['Genomics', 'Bio-Informatics', 'Python', 'R'];
    if (t.includes('agri') || t.includes('farm')) return ['Crop Systems', 'IoT Sensors', 'Sustainability', 'Data Analysis'];
    if (t.includes('urban') || t.includes('city')) return ['GIS', 'Urban Planning', 'AutoCAD', 'Smart Grid'];
    if (t.includes('data') || t.includes('soft') || t.includes('dev') || t.includes('engineer')) return ['React', 'Node.js', 'Python', 'SQL', 'System Design'];
    return ['Project Management', 'Data Analysis', 'Communication', 'Technical Writing'];
}
