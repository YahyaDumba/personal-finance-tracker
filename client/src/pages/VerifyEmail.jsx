import { useEffect, useEffectEvent, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import { verifyEmail } from "../services/api";

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState(false);
    const token = searchParams.get('token');

    useEffect(() => {
        const verify = async () => {
            if (!token) {
                setStatus('error');
                return;
            }
            try {
                await verifyEmail(token);
                setStatus('Success');
            } catch (error) {
                setStatus('Error')
            }
        }
        verify();
    }, [token])
    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
            <div className="w-full max-w-md text-center">

                {/* Logo */}
                <Link to="/" className="inline-flex items-center gap-2 mb-10">
                    {/* <span className="text-3xl">💎</span> */}
                    <span className="text-4xl font-bold text-white">FinTrack</span>
                </Link>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10">
                    {status === 'loading' && (
                        <>
                            <Loader className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-white mb-2">Verifying...</h2>
                            <p className="text-gray-400">Please wait while we verify your email.</p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-white mb-2">Email Verified!</h2>
                            <p className="text-gray-400 mb-8">
                                Your email has been verified successfully. You can now sign in.
                            </p>
                            <Link to="/login"
                                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-semibold transition-colors inline-block">
                                Sign In Now
                            </Link>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-white mb-2">Verification Failed</h2>
                            <p className="text-gray-400 mb-8">
                                Invalid or expired verification link. Please register again.
                            </p>
                            <Link to="/register"
                                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-semibold transition-colors inline-block">
                                Register Again
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}