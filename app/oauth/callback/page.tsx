'use client'
import LoadingOverlay from "@/components/loading";
import { Button } from "@/components/ui/button";
import { useAuthCallBack } from "@/store/use-auth-store";
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react";

export default function OAuthCallbackPage() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const { handleCallback } = useAuthCallBack();
	const [isProcessing, setIsProcessing] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const processCallback = async () => {
			try {
				// Conver URLSearchParams to the expected format
				const params = new URLSearchParams();
				searchParams.forEach((value, key) => {
					params.append(key, value);
				})

				await handleCallback(params);

				router.push("/")
			} catch (error) {
				console.error('OAuth callback error:', error);
        setError(error instanceof Error ? error.message : 'Đăng nhập thất bại');
			} finally {
        setIsProcessing(false);
      }
		}
		
		if (searchParams) {
			processCallback();
		}
	}, []);

	if (isProcessing) {
    return (
      <LoadingOverlay />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Login Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Back to login page
          </Button>
        </div>
      </div>
    );
  }

  return null;
}