import { Code, Target, Trophy } from "lucide-react";

export default function FeatureHightlight() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
			<div className="shadow-lg group p-8 bg-white border border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-sm transform hover:scale-102 transition-all duration-200">
				<div className="flex items-center justify-center mb-6">
					<div className="p-3 bg-gray-100 rounded-lg">
						<Code className="h-6 w-6 text-orange-400" />
					</div>
				</div>
				<h3 className="text-lg font-semibold text-black mb-2">1000+ Problems</h3>
				<p className="text-gray-600 text-sm">From beginner to expert level</p>
			</div>

			<div className="shadow-lg group p-8 bg-white border border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-sm transform hover:scale-102 transition-all duration-200">
				<div className="flex items-center justify-center mb-6">
					<div className="p-3 bg-gray-100 rounded-lg">
						<Trophy className="h-6 w-6 text-yellow-400" />
					</div>
				</div>
				<h3 className="text-lg font-semibold text-black mb-2">Live Contests</h3>
				<p className="text-gray-600 text-sm">Compete with developers worldwide</p>
			</div>

			<div className="shadow-lg group p-8 bg-white border border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-sm transform hover:scale-102 transition-all duration-200">
				<div className="flex items-center justify-center mb-6">
					<div className="p-3 bg-gray-100 rounded-lg">
						<Target className="h-6 w-6 text-red-400" />
					</div>
				</div>
				<h3 className="text-lg font-semibold text-black mb-2">Real-time Judge</h3>
				<p className="text-gray-600 text-sm">Instant feedback & solutions</p>
			</div>
		</div>
	)
}