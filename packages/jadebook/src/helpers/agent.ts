type AgentItem = {
	user_id: string;
	agent_id: string;
	title: string;
	description: string;
	context: string;
	icon: string;
	modified_at: string;
	created_at: string;
};

export const JADEBOOK_AGENT_PRESETS: AgentItem[] = [
	{
		user_id: "jadebook",
		agent_id: "preset-memory",
		title: "Connection with Memory",
		description:
			"Use your memory to find any key events, people, or aspects of you that are linked with the themes of the entry.",
		context:
			"Use the `User Memory` if available and find connections between the memory and the journal entry",
		icon: "brain:bold:cyan",
		modified_at: new Date().toISOString(),
		created_at: new Date().toISOString(),
	},
	{
		user_id: "jadebook",
		agent_id: "preset-traps",
		title: "Thinking Traps",
		description: "Analyze the text and look for thinking traps",
		context:
			"Analyze the following journal entry, specifically looking for examples of these thinking traps: All-or-Nothing Thinking, Overgeneralization, Selective Abstraction, Disqualifying the Positive, Jumping to Conclusions, Catastrophizing, Emotional Reasoning\n\nGive a short explanation for your reasoning behind the identified thinking traps",
		icon: "lightning:fill:amber",
		modified_at: new Date().toISOString(),
		created_at: new Date().toISOString(),
	},
];
