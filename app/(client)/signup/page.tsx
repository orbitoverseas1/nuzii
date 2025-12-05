"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import Container from "@/components/Container";
import { Loader2 } from "lucide-react";

const SignUpPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { googleLogin } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            await updateProfile(userCredential.user, {
                displayName: name,
            });
            toast.success("Account created successfully");
            router.push("/");
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                toast.error(error.message || "Failed to create account");
            } else {
                toast.error("Failed to create account");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await googleLogin();
            router.push("/");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container className="py-20 flex items-center justify-center min-h-[60vh]">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-nuziiSand/30">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-serif text-nuziiText mb-2">
                        Create Account
                    </h1>
                    <p className="text-nuziiTextLight text-sm">
                        Join Nuzii for exclusive offers and faster checkout
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-nuziiText mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-nuziiSand focus:border-nuziiRoseGold focus:ring-1 focus:ring-nuziiRoseGold outline-none transition-all"
                            placeholder="Jane Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-nuziiText mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-nuziiSand focus:border-nuziiRoseGold focus:ring-1 focus:ring-nuziiRoseGold outline-none transition-all"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-nuziiText mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full px-4 py-3 rounded-lg border border-nuziiSand focus:border-nuziiRoseGold focus:ring-1 focus:ring-nuziiRoseGold outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-nuziiRoseGold hover:bg-nuziiRoseGoldDark text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            "Create Account"
                        )}
                    </button>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-nuziiSand"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-nuziiTextLight">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        type="button"
                        className="mt-6 w-full border border-nuziiSand hover:bg-nuziiCream/30 text-nuziiText font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Google
                    </button>
                </div>

                <p className="mt-8 text-center text-sm text-nuziiTextLight">
                    Already have an account?{" "}
                    <Link
                        href="/signin"
                        className="font-medium text-nuziiRoseGoldDark hover:underline"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </Container>
    );
};

export default SignUpPage;
