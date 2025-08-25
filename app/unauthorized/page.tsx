'use client';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/use-auth-store';

export default function UnauthorizedPage() {
	const router = useRouter();
	const { user, logout } = useAuthStore();

	const handleGoHome = () => {
		router.push('/');
	};

	const handleLogout = async () => {
		await logout();
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
				<div className="mb-6">
					<svg
						className="mx-auto h-16 w-16 text-red-500"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
						/>
					</svg>
				</div>

				<h1 className="text-2xl font-bold text-gray-900 mb-4">
					No permission
				</h1>

				<p className="text-gray-600 mb-6">
					You do not have access to the admin page. Please contact the administrator for permission.
				</p>

				{user && (
					<div className="bg-gray-100 rounded-lg p-4 mb-6">
						<p className="text-sm text-gray-700">
							<span className="font-semibold">Current account:</span> {user.email}
						</p>
					</div>
				)}

				<div className="space-y-3">
					<button
						onClick={handleGoHome}
						className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
					>
						Go to homepage
					</button>

					<button
						onClick={handleLogout}
						className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
					>
						Log out
					</button>
				</div>
			</div>
		</div>
	);
}