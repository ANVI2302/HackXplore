const API_URL = "http://localhost:8000/api/v1";

export interface ApiUser {
    id: string;
    email: string;
    full_name: string;
    title?: string;
    skills: { id: string; name: string; level?: number; category?: string }[];
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
}

export interface Achievement {
    id: string;
    user_id: string;
    title: string;
    description: string;
    badge_name: string;
    icon_url?: string;
    earned_at: string;
}

export interface Project {
    id: string;
    user_id: string;
    title: string;
    description: string;
    skills_used: string[];
    github_url?: string;
    demo_url?: string;
    image_url?: string;
    start_date?: string;
    end_date?: string;
    endorsement_count: number;
    created_at: string;
}

export interface Course {
    id: string;
    title: string;
    description: string;
    provider: string;
    url: string;
    difficulty_level: string;
    duration_hours: number;
    skills_covered: string[];
    rating: number;
    created_at: string;
}

export interface Mentorship {
    id: string;
    mentor: { id: string; full_name: string; title?: string; avatar_url?: string };
    skill_focus: string;
    status: string;
    started_at?: string;
    created_at: string;
}

export interface Notification {
    id: string;
    user_id: string;
    type: string;
    title: string;
    message: string;
    related_id?: string;
    is_read: boolean;
    created_at: string;
}

let authToken: string | null = null;

export const api = {
    setToken(token: string) {
        authToken = token;
    },

    getToken() {
        return authToken;
    },

    async login(email: string, password: string): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ username: email, password })
        });
        if (!response.ok) throw new Error("Login failed");
        return response.json();
    },

    async register(email: string, full_name: string, password: string): Promise<ApiUser> {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, full_name, password })
        });
        if (!response.ok) throw new Error("Registration failed");
        return response.json();
    },

    async getProfile(token: string): Promise<ApiUser> {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to fetch profile");
        return response.json();
    },

    async updateProfile(token: string, data: { full_name?: string; title?: string; skills?: string[] }): Promise<ApiUser> {
        const response = await fetch(`${API_URL}/auth/me`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error("Profile update failed");
        return response.json();
    },

    // Achievements
    async getAchievements(token: string) {
        const response = await fetch(`${API_URL}/achievements/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to fetch achievements");
        return response.json();
    },

    async createAchievement(token: string, data: any) {
        const response = await fetch(`${API_URL}/achievements`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error("Failed to create achievement");
        return response.json();
    },

    // Projects
    async getProjects(token: string) {
        const response = await fetch(`${API_URL}/projects/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to fetch projects");
        return response.json();
    },

    async createProject(token: string, data: any) {
        const response = await fetch(`${API_URL}/projects`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error("Failed to create project");
        return response.json();
    },

    async updateProject(token: string, projectId: string, data: any) {
        const response = await fetch(`${API_URL}/projects/${projectId}`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error("Failed to update project");
        return response.json();
    },

    async deleteProject(token: string, projectId: string) {
        const response = await fetch(`${API_URL}/projects/${projectId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to delete project");
    },

    async endorseProject(token: string, projectId: string) {
        const response = await fetch(`${API_URL}/projects/${projectId}/endorse`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to endorse project");
        return response.json();
    },

    // Courses
    async getCourses(token: string, difficulty?: string) {
        const url = new URL(`${API_URL}/courses`);
        if (difficulty) url.searchParams.append("difficulty", difficulty);
        const response = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to fetch courses");
        return response.json();
    },

    async getRecommendedCourses(token: string) {
        const response = await fetch(`${API_URL}/courses/recommendations`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to fetch recommendations");
        return response.json();
    },

    async getCoursesBySkill(token: string, skill: string) {
        const response = await fetch(`${API_URL}/courses/by-skill/${skill}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to fetch courses");
        return response.json();
    },

    // Mentorships
    async getMentors(token: string) {
        const response = await fetch(`${API_URL}/mentorships/mentors`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to fetch mentors");
        return response.json();
    },

    async getMentees(token: string) {
        const response = await fetch(`${API_URL}/mentorships/mentees`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to fetch mentees");
        return response.json();
    },

    async getAvailableMentors(token: string, skillFocus: string) {
        const response = await fetch(`${API_URL}/mentorships/available-mentors?skill_focus=${skillFocus}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to fetch available mentors");
        return response.json();
    },

    async createMentorship(token: string, data: any) {
        const response = await fetch(`${API_URL}/mentorships`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error("Failed to create mentorship");
        return response.json();
    },

    async updateMentorship(token: string, mentorshipId: string, data: any) {
        const response = await fetch(`${API_URL}/mentorships/${mentorshipId}`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error("Failed to update mentorship");
        return response.json();
    },

    async cancelMentorship(token: string, mentorshipId: string) {
        const response = await fetch(`${API_URL}/mentorships/${mentorshipId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to cancel mentorship");
    },

    // Notifications
    async getNotifications(token: string) {
        const response = await fetch(`${API_URL}/notifications`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to fetch notifications");
        return response.json();
    },

    async markNotificationsRead(token: string, notificationIds: string[]) {
        const response = await fetch(`${API_URL}/notifications/mark-read`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({ notification_ids: notificationIds })
        });
        if (!response.ok) throw new Error("Failed to mark notifications");
        return response.json();
    },

    async deleteNotification(token: string, notificationId: string) {
        const response = await fetch(`${API_URL}/notifications/${notificationId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to delete notification");
    },

    async getUnreadNotificationCount(token: string) {
        const response = await fetch(`${API_URL}/notifications/unread-count`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to fetch unread count");
        return response.json();
    }
};
