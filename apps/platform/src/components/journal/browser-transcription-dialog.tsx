"use client";

import { Coolshape } from "coolshapes-react";
import { toast } from "sonner";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { useEditor } from "@/providers/editor-provider";
import { EmptyContent } from "../app/empty-content";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";

/**
 * A dialog specifically for browser transcription.
 */
export function BrowserTranscriptionDialog({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const { editor } = useEditor();

	const {
		// Speech recognition state
		isSupported,
		isListening,
		currentTranscript,
		finalTranscripts,

		// Controls
		startTranscription,
		stopTranscription,
		clearTranscripts,
	} = useSpeechToText({
		onError: (error) => {
			toast.error(
				`An error occurred while using browser transcription: ${error}`,
			);
		},
		language: "en-US",
		continuous: true,
		interimResults: true,
	});

	return (
		<Dialog
			open={open}
			onOpenChange={(open) => {
				if (!open) {
					if (isListening) {
						stopTranscription();
					}
				}

				onOpenChange(open);
			}}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Browser Transcription</DialogTitle>
					<DialogDescription>
						Free users can use their browser's speech recognition to transcribe
						their entries. It's not as accurate as the AI transcription, but
						it's a good way to get started and has the benefit of being
						real-time. Only English is supported.
					</DialogDescription>
				</DialogHeader>

				{!isSupported && (
					<EmptyContent
						title="Speech recognition not supported"
						description="Your browser does not support speech recognition. Please try a different browser."
						icon={
							<Coolshape type="rectangle" index={2} noise={true} size={100} />
						}
					/>
				)}

				{isSupported && (
					<div className="p-1">
						<Textarea
							value={
								isListening ? currentTranscript : finalTranscripts.join(" ")
							}
							className="resize-none max-h-[40vh] overflow-y-auto"
							placeholder="Start the speech recognition and speak something"
							readOnly
						/>
					</div>
				)}

				{!isSupported && (
					<DialogFooter>
						<Button variant="outline" onClick={() => onOpenChange(false)}>
							Close
						</Button>
					</DialogFooter>
				)}

				{isSupported && (
					<DialogFooter className="justify-between sm:justify-between w-full flex-row">
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								onClick={clearTranscripts}
								disabled={isListening || finalTranscripts.length === 0}
							>
								Clear
							</Button>
						</div>

						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								onClick={() => onOpenChange(false)}
								className="hidden sm:block"
							>
								{isListening ? "Cancel" : "Close"}
							</Button>

							{!isListening && finalTranscripts.length === 0 && (
								<Button onClick={startTranscription}>Start Recognition</Button>
							)}

							{isListening && (
								<Button onClick={stopTranscription}>Stop Recognition</Button>
							)}

							{!isListening && finalTranscripts.length > 0 && (
								<Button
									onClick={() => {
										if (!editor) {
											toast.error("Unable to save transcript");
										}

										// Insert the transcribed paragraphs at the end of the document.
										const endPosition = editor.state.doc.content.size;

										editor.commands.insertContentAt(
											endPosition,
											finalTranscripts.map((transcript) => ({
												type: "paragraph",
												content: [
													{
														type: "text",
														text: transcript,
													},
												],
											})),
										);

										onOpenChange(false);
									}}
								>
									Save Transcription
								</Button>
							)}
						</div>
					</DialogFooter>
				)}
			</DialogContent>
		</Dialog>
	);
}
