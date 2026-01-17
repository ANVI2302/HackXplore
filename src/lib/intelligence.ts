
// Logic for generating specialized dashboard data based on user profile

interface UserProfile {
    name: string;
    title?: string;
    skills?: string[];
}

export const generateDashboardData = (user: UserProfile) => {
    const title = user.title?.toLowerCase() || "";
    const skills = user.skills?.map(s => s.toLowerCase()) || [];

    // 1. Determine Archetype
    let archetype = "generalist";
    if (title.includes("bio") || skills.some(s => s.includes("bio") || s.includes("gene"))) archetype = "bio";
    else if (title.includes("agri") || title.includes("farm") || skills.some(s => s.includes("crop"))) archetype = "agri";
    else if (title.includes("urban") || title.includes("city") || skills.some(s => s.includes("gis"))) archetype = "urban";
    else if (title.includes("data") || title.includes("soft") || skills.some(s => s.includes("python") || s.includes("ai") || s.includes("react") || s.includes("node"))) archetype = "data";

    // 2. Generate Competence Matrix (Radar Chart)
    const skillMatrix = getSkillMatrix(archetype, skills);

    // 3. Generate Daily Directives
    const directives = getDirectives(archetype);

    // 4. Generate Neural Insights
    const insights = getInsights(archetype, user.name);

    // 5. Generate Career/Skill Architecture
    const careerPath = getCareerPath(archetype);

    return {
        archetype,
        skillMatrix,
        directives,
        insights,
        careerPath
    };
};

function getSkillMatrix(archetype: string, userSkills: string[]) {
    const base = [
        { subject: 'System Architecture', A: 80, fullMark: 150 },
        { subject: 'Data Ethics', A: 90, fullMark: 150 },
        { subject: 'Project Mgmt', A: 70, fullMark: 150 },
    ];

    let specific: { subject: string; A: number; fullMark: number }[] = [];

    switch (archetype) {
        case "bio":
            specific = [
                { subject: 'Bio-Informatics', A: 130, fullMark: 150 },
                { subject: 'Genomics', A: 110, fullMark: 150 },
                { subject: 'Python', A: 95, fullMark: 150 },
            ];
            break;
        case "agri":
            specific = [
                { subject: 'Crop Systems', A: 125, fullMark: 150 },
                { subject: 'IoT Protocols', A: 100, fullMark: 150 },
                { subject: 'Sustainability', A: 115, fullMark: 150 },
            ];
            break;
        case "urban":
            specific = [
                { subject: 'Urban GIS', A: 140, fullMark: 150 },
                { subject: 'Spatial Analysis', A: 105, fullMark: 150 },
                { subject: 'Civil Eng', A: 90, fullMark: 150 },
            ];
            break;
        default: // general/data
            specific = [
                { subject: 'Full Stack', A: 110, fullMark: 150 },
                { subject: 'Cloud Infra', A: 100, fullMark: 150 },
                { subject: 'AI/ML', A: 120, fullMark: 150 },
            ];
            break;
    }

    const matrix = [...specific, ...base];

    // Boost scores if user specifically lists these skills
    return matrix.map(item => {
        const match = userSkills.some(skill =>
            item.subject.toLowerCase().includes(skill) || skill.includes(item.subject.toLowerCase())
        );
        return match ? { ...item, A: Math.min(150, item.A + 20) } : item;
    });
}

function getDirectives(archetype: string) {
    const common = { id: 3, task: "Update Skill Profile with new Cert", time: "5m", priority: "LOW" };

    switch (archetype) {
        case "bio":
            return [
                { id: 1, task: "Analyze CRISPR Sequence Data Batch #404", time: "45m", priority: "HIGH" },
                { id: 2, task: "Review protein folding simulation results", time: "25m", priority: "MED" },
                common
            ];
        case "agri":
            return [
                { id: 1, task: "Calibrate Soil Moisture Sensors (Zone 4)", time: "30m", priority: "HIGH" },
                { id: 2, task: "Review drone telemetry logs", time: "15m", priority: "MED" },
                common
            ];
        case "urban":
            return [
                { id: 1, task: "Optimize Traffic Flow Algorithm (Sector 7)", time: "1h", priority: "HIGH" },
                { id: 2, task: "Update GIS heatmap layers", time: "20m", priority: "MED" },
                common
            ];
        default:
            return [
                { id: 1, task: "Refactor Authentication Microservice", time: "45m", priority: "HIGH" },
                { id: 2, task: "Review Pull Request #42 in CommuteOS", time: "15m", priority: "MED" },
                common
            ];
    }
}

function getInsights(archetype: string, name: string) {
    switch (archetype) {
        case "bio":
            return `"Operative ${name}, your genomic sequencing efficiency is in the top 5 percentile. Recommendation: Focus on 'Viral Vector Analysis' to unlock the Lead Researcher role."`;
        case "agri":
            return `"Operative ${name}, crop yield predictions are 12% more accurate this week. Recommendation: Integrate 'Satellite Imagery Analysis' to further refine precision farming models."`;
        case "urban":
            return `"Operative ${name}, traffic congestion models are converging. Recommendation: Deepen knowledge in 'Smart Grid Energy Distribution' to become a holistic Smart City Architect."`;
        default:
            return `"Operative ${name}, your code velocity is stable. Recommendation: Explore 'Rust Systems Programming' to optimize low-level performance and unlock high-frequency trading projects."`;
    }
}

function getCareerPath(archetype: string) {
    switch (archetype) {
        case "bio":
            return [
                {
                    role: "Lead Bio-Data Architect",
                    match: 88,
                    missing: ["Clinical Trials Mgmt"],
                    course: "Clinical Data Standards (CDISC)",
                    project: "Automated Drug Discovery Pipeline",
                    projectReady: true
                },
                {
                    role: "Genomic Systems Engineer",
                    match: 65,
                    missing: ["HPC Clusters", "CUDA"],
                    course: "High Performance Computing for Bio",
                    project: "Parallel DNA Sequencing Engine",
                    projectReady: false
                }
            ];
        case "agri":
            return [
                {
                    role: "Autonomous Farm Systems Lead",
                    match: 92,
                    missing: [],
                    course: "Advanced Robotics Control",
                    project: "Drone Swarm Pesticide Deployment",
                    projectReady: true
                },
                {
                    role: "Agricultural Data Scientist",
                    match: 74,
                    missing: ["Deep Learning"],
                    course: "Computer Vision for Plant Disease",
                    project: "Leaf Pathology Classifier",
                    projectReady: false
                }
            ];
        case "urban":
            return [
                {
                    role: "Smart City Chief Architect",
                    match: 85,
                    missing: ["Policy Frameworks"],
                    course: "Urban Policy & Data Governance",
                    project: "City-Wide IoT Grid Simulation",
                    projectReady: true
                },
                {
                    role: "Transportation Systems Engineer",
                    match: 70,
                    missing: ["Traffic Flow Theory"],
                    course: "Micro-simulation of Traffic Networks",
                    project: "Adaptive Traffic Light Controller",
                    projectReady: false
                }
            ];
        default:
            return [
                {
                    role: "Principal Systems Architect",
                    match: 78,
                    missing: ["Rust", "Distributed Systems"],
                    course: "Rust for Embedded Systems 101",
                    project: "Distributed Ledger for Supply Chain",
                    projectReady: false
                },
                {
                    role: "AI Solutions Lead",
                    match: 92,
                    missing: [],
                    course: "Large Language Model Ops",
                    project: "Neural Search Engine",
                    projectReady: true
                }
            ];
    }
}
