// we need to load all classes due to how tailwind works
export const tagColors = {
	slate: {
		outline: "border-slate-600 text-slate-600",
		color: "bg-slate-200 text-slate-700 border-slate-600",
		text: "text-slate-600 bg-background",
		flat: "bg-slate-600 text-slate-100 border-slate-600",
	},
	gray: {
		outline: "border-gray-600 text-gray-600",
		color: "bg-gray-200 text-gray-700 border-gray-600",
		text: "text-gray-600 bg-background",
		flat: "bg-gray-600 text-gray-100 border-gray-600",
	},
	zinc: {
		outline: "border-zinc-600 text-zinc-600",
		color: "bg-zinc-200 text-zinc-700 border-zinc-600",
		text: "text-zinc-600 bg-background",
		flat: "bg-zinc-600 text-zinc-100 border-zinc-600",
	},
	neutral: {
		outline: "border-neutral-600 text-neutral-600",
		color: "bg-neutral-200 text-neutral-700 border-neutral-600",
		text: "text-neutral-600 bg-background",
		flat: "bg-neutral-600 text-neutral-100 border-neutral-600",
	},
	stone: {
		outline: "border-stone-600 text-stone-600",
		color: "bg-stone-200 text-stone-700 border-stone-600",
		text: "text-stone-600 bg-background",
		flat: "bg-stone-600 text-stone-100 border-stone-600",
	},
	red: {
		outline: "border-red-600 text-red-600",
		color: "bg-red-200 text-red-700 border-red-600",
		text: "text-red-600 bg-background",
		flat: "bg-red-600 text-red-100 border-red-600",
	},
	orange: {
		outline: "border-orange-600 text-orange-600",
		color: "bg-orange-200 text-orange-700 border-orange-600",
		text: "text-orange-600 bg-background",
		flat: "bg-orange-600 text-orange-100 border-orange-600",
	},
	amber: {
		outline: "border-amber-600 text-amber-600",
		color: "bg-amber-200 text-amber-700 border-amber-600",
		text: "text-amber-600 bg-background",
		flat: "bg-amber-600 text-amber-100 border-amber-600",
	},
	yellow: {
		outline: "border-yellow-600 text-yellow-600",
		color: "bg-yellow-200 text-yellow-700 border-yellow-600",
		text: "text-yellow-600 bg-background",
		flat: "bg-yellow-600 text-yellow-100 border-yellow-600",
	},
	lime: {
		outline: "border-lime-600 text-lime-600",
		color: "bg-lime-200 text-lime-700 border-lime-600",
		text: "text-lime-600 bg-background",
		flat: "bg-lime-600 text-lime-100 border-lime-600",
	},
	green: {
		outline: "border-green-600 text-green-600",
		color: "bg-green-200 text-green-700 border-green-600",
		text: "text-green-600 bg-background",
		flat: "bg-green-600 text-green-100 border-green-600",
	},
	emerald: {
		outline: "border-emerald-600 text-emerald-600",
		color: "bg-emerald-200 text-emerald-700 border-emerald-600",
		text: "text-emerald-600 bg-background",
		flat: "bg-emerald-600 text-emerald-100 border-emerald-600",
	},
	teal: {
		outline: "border-teal-600 text-teal-600",
		color: "bg-teal-200 text-teal-700 border-teal-600",
		text: "text-teal-600 bg-background",
		flat: "bg-teal-600 text-teal-100 border-teal-600",
	},
	cyan: {
		outline: "border-cyan-600 text-cyan-600",
		color: "bg-cyan-200 text-cyan-700 border-cyan-600",
		text: "text-cyan-600 bg-background",
		flat: "bg-cyan-600 text-cyan-100 border-cyan-600",
	},
	sky: {
		outline: "border-sky-600 text-sky-600",
		color: "bg-sky-200 text-sky-700 border-sky-600",
		text: "text-sky-600 bg-background",
		flat: "bg-sky-600 text-sky-100 border-sky-600",
	},
	blue: {
		outline: "border-blue-600 text-blue-600",
		color: "bg-blue-200 text-blue-700 border-blue-600",
		text: "text-blue-600 bg-background",
		flat: "bg-blue-600 text-blue-100 border-blue-600",
	},
	indigo: {
		outline: "border-indigo-600 text-indigo-600",
		color: "bg-indigo-200 text-indigo-700 border-indigo-600",
		text: "text-indigo-600 bg-background",
		flat: "bg-indigo-600 text-indigo-100 border-indigo-600",
	},
	violet: {
		outline: "border-violet-600 text-violet-600",
		color: "bg-violet-200 text-violet-700 border-violet-600",
		text: "text-violet-600 bg-background",
		flat: "bg-violet-600 text-violet-100 border-violet-600",
	},
	purple: {
		outline: "border-purple-600 text-purple-600",
		color: "bg-purple-200 text-purple-700 border-purple-600",
		text: "text-purple-600 bg-background",
		flat: "bg-purple-600 text-purple-100 border-purple-600",
	},
	fuchsia: {
		outline: "border-fuchsia-600 text-fuchsia-600",
		color: "bg-fuchsia-200 text-fuchsia-700 border-fuchsia-600",
		text: "text-fuchsia-600 bg-background",
		flat: "bg-fuchsia-600 text-fuchsia-100 border-fuchsia-600",
	},
	pink: {
		outline: "border-pink-600 text-pink-600",
		color: "bg-pink-200 text-pink-700 border-pink-600",
		text: "text-pink-600 bg-background",
		flat: "bg-pink-600 text-pink-100 border-pink-600",
	},
	rose: {
		outline: "border-rose-600 text-rose-600",
		color: "bg-rose-200 text-rose-700 border-rose-600",
		text: "text-rose-600 bg-background",
		flat: "bg-rose-600 text-rose-100 border-rose-600",
	},
} as const;

export const tagVariants = ["outline", "color", "text", "flat"] as const;
