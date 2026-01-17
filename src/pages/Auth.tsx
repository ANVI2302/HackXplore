import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/AuthContext'

export default function AuthPage() {
    const navigate = useNavigate()
    const { login, register } = useAuth()
    const [isLogin, setIsLogin] = useState(false)
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<{ email?: string; name?: string; password?: string }>({})

    const validateForm = () => {
        const newErrors: typeof errors = {}
        
        if (!email || !email.includes('@')) {
            newErrors.email = 'Please enter a valid email'
        }
        
        if (!isLogin && !name) {
            newErrors.name = 'Full name is required'
        }
        
        if (!password || password.length < 3) {
            newErrors.password = 'Password must be at least 3 characters'
        }
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!validateForm()) return

        setIsLoading(true)
        try {
            if (isLogin) {
                await login(email, password)
            } else {
                await register(email, name, password)
            }
        } catch (error: any) {
            setErrors({ email: error.message || 'An error occurred' })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-900 via-cyan-900 to-blue-900 p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </h1>
                    <p className="text-cyan-200">
                        {isLogin ? 'Welcome back!' : 'Join us and start your journey'}
                    </p>
                </div>

                {/* Auth Card */}
                <Card className="bg-blue-800/50 border-cyan-700 backdrop-blur-sm">
                    <CardHeader className="pb-6">
                        <div className="text-center">
                            <p className="text-cyan-100 font-medium">{isLogin ? 'Sign In' : 'Sign Up'}</p>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name Field - Only for Register */}
                            {!isLogin && (
                                <div>
                                    <Label htmlFor="name" className="text-cyan-100 text-sm font-medium">
                                        Full Name
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => {
                                            setName(e.target.value)
                                            if (errors.name) setErrors({ ...errors, name: '' })
                                        }}
                                        className="mt-1 bg-blue-700 border-cyan-600 text-white placeholder:text-cyan-400 focus:border-cyan-500 focus:ring-cyan-500"
                                    />
                                    {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                                </div>
                            )}

                            {/* Email Field */}
                            <div>
                                <Label htmlFor="email" className="text-cyan-100 text-sm font-medium">
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                        if (errors.email) setErrors({ ...errors, email: '' })
                                    }}
                                    className="mt-1 bg-blue-700 border-cyan-600 text-white placeholder:text-cyan-400 focus:border-cyan-500 focus:ring-cyan-500"
                                />
                                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                            </div>

                            {/* Password Field */}
                            <div>
                                <Label htmlFor="password" className="text-cyan-100 text-sm font-medium">
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                        if (errors.password) setErrors({ ...errors, password: '' })
                                    }}
                                    className="mt-1 bg-blue-700 border-cyan-600 text-white placeholder:text-cyan-400 focus:border-cyan-500 focus:ring-cyan-500"
                                />
                                {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 mt-6 transition-all"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        {isLogin ? 'Signing in...' : 'Creating account...'}
                                    </span>
                                ) : (
                                    isLogin ? 'Sign In' : 'Create Account'
                                )}
                            </Button>

                            {/* Toggle Login/Register */}
                            <div className="text-center mt-4">
                                <p className="text-cyan-200 text-sm">
                                    {isLogin ? "Don't have an account? " : 'Already have an account? '}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsLogin(!isLogin)
                                            setErrors({})
                                            setEmail('')
                                            setName('')
                                            setPassword('')
                                        }}
                                        className="text-cyan-300 hover:text-cyan-200 font-semibold transition-colors"
                                    >
                                        {isLogin ? 'Sign Up' : 'Sign In'}
                                    </button>
                                </p>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
