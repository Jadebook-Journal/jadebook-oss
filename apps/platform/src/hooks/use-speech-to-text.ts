import React from "react";

// Type declarations for Web Speech API
declare global {
	interface Window {
		SpeechRecognition: typeof SpeechRecognition;
		webkitSpeechRecognition: typeof SpeechRecognition;
	}
}

interface SpeechRecognition extends EventTarget {
	continuous: boolean;
	interimResults: boolean;
	lang: string;
	maxAlternatives: number;
	start(): void;
	stop(): void;
	onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
	onend: ((this: SpeechRecognition, ev: Event) => void) | null;
	onerror:
		| ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void)
		| null;
	onresult:
		| ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void)
		| null;
}

interface SpeechRecognitionErrorEvent extends Event {
	error: string;
	message: string;
}

interface SpeechRecognitionEvent extends Event {
	resultIndex: number;
	results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
	length: number;
	item(index: number): SpeechRecognitionResult;
	[index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
	isFinal: boolean;
	length: number;
	item(index: number): SpeechRecognitionAlternative;
	[index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
	transcript: string;
	confidence: number;
}

declare const SpeechRecognition: {
	prototype: SpeechRecognition;
	new (): SpeechRecognition;
};

interface UseSpeechToTextOptions {
	onTranscript?: (text: string, isFinal: boolean) => void;
	onError?: (error: Error) => void;
	language?: string;
	continuous?: boolean;
	interimResults?: boolean;
	maxAlternatives?: number;
}

interface UseSpeechToTextReturn {
	// Speech recognition state
	isSupported: boolean;
	isListening: boolean;
	transcriptionError: string | null;
	currentTranscript: string;
	finalTranscripts: string[];

	// Controls
	startTranscription: () => void;
	stopTranscription: () => void;
	clearTranscripts: () => void;
}

// Check if SpeechRecognition is supported
const getSpeechRecognition = (): typeof SpeechRecognition | null => {
	if (typeof window === "undefined") return null;

	return window.SpeechRecognition || window.webkitSpeechRecognition || null;
};

export const useSpeechToText = ({
	onTranscript,
	onError,
	language = "en-US",
	continuous = true,
	interimResults = true,
	maxAlternatives = 1,
}: UseSpeechToTextOptions): UseSpeechToTextReturn => {
	const [isListening, setIsListening] = React.useState(false);
	const [transcriptionError, setTranscriptionError] = React.useState<
		string | null
	>(null);
	const [currentTranscript, setCurrentTranscript] = React.useState("");
	const [finalTranscripts, setFinalTranscripts] = React.useState<string[]>([]);

	const recognitionRef = React.useRef<SpeechRecognition | null>(null);
	const isSupported = React.useMemo(() => !!getSpeechRecognition(), []);

	const handleTranscript = React.useCallback(
		(text: string, isFinal: boolean) => {
			if (isFinal) {
				setFinalTranscripts((prev) => {
					const updated = [...prev, text];

					return updated;
				});

				setCurrentTranscript("");
			} else {
				setCurrentTranscript(text);
			}

			onTranscript?.(text, isFinal);
		},
		[onTranscript],
	);

	const handleError = React.useCallback(
		(error: Error) => {
			console.error("❌ Speech recognition error in hook:", error);

			setTranscriptionError(error.message);
			setIsListening(false);
			onError?.(error);
		},
		[onError],
	);

	const initializeSpeechRecognition = React.useCallback(() => {
		const SpeechRecognition = getSpeechRecognition();

		if (!SpeechRecognition) {
			const error = new Error(
				"Speech recognition is not supported in this browser",
			);

			handleError(error);
			return null;
		}

		const recognition = new SpeechRecognition();

		// Configure recognition
		recognition.continuous = continuous;
		recognition.interimResults = interimResults;
		recognition.lang = language;
		recognition.maxAlternatives = maxAlternatives;

		// Event handlers
		recognition.onstart = () => {
			setIsListening(true);
			setTranscriptionError(null);
		};

		recognition.onend = () => {
			setIsListening(false);
		};

		recognition.onerror = (event) => {
			console.error("❌ Speech recognition error:", event.error);

			let errorMessage = "Speech recognition error";

			switch (event.error) {
				case "no-speech":
					errorMessage = "No speech was detected. Please try again.";
					break;
				case "audio-capture":
					errorMessage = "Audio capture failed. Please check your microphone.";
					break;
				case "not-allowed":
					errorMessage =
						"Microphone access denied. Please allow microphone permissions.";
					break;
				case "network":
					errorMessage = "Network error occurred during speech recognition.";
					break;
				case "service-not-allowed":
					errorMessage = "Speech recognition service is not allowed.";
					break;
				case "bad-grammar":
					errorMessage = "Grammar error in speech recognition.";
					break;
				case "language-not-supported":
					errorMessage = `Language '${language}' is not supported.`;
					break;
				default:
					errorMessage = `Speech recognition error: ${event.error}`;
			}

			const error = new Error(errorMessage);
			handleError(error);
		};

		recognition.onresult = (event) => {
			let interimTranscript = "";
			let finalTranscript = "";

			// Process all results
			for (let i = event.resultIndex; i < event.results.length; i++) {
				const result = event.results[i];
				const transcript = result[0].transcript;

				if (result.isFinal) {
					finalTranscript += transcript;
				} else {
					interimTranscript += transcript;
				}
			}

			// Handle final transcript
			if (finalTranscript) {
				handleTranscript(finalTranscript.trim(), true);
			}

			// Handle interim transcript
			if (interimTranscript) {
				handleTranscript(interimTranscript.trim(), false);
			}
		};

		return recognition;
	}, [
		continuous,
		interimResults,
		language,
		maxAlternatives,
		handleTranscript,
		handleError,
	]);

	const startTranscription = React.useCallback(() => {
		if (!isSupported) {
			const error = new Error(
				"Speech recognition is not supported in this browser",
			);

			handleError(error);

			return;
		}

		if (isListening) {
			return;
		}

		try {
			// Stop any existing recognition
			if (recognitionRef.current) {
				recognitionRef.current.stop();
			}

			// Initialize new recognition
			const recognition = initializeSpeechRecognition();
			if (!recognition) return;

			recognitionRef.current = recognition;
			setCurrentTranscript("");
			setTranscriptionError(null);

			// Start recognition
			recognition.start();
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error";

			handleError(new Error(errorMessage));
		}
	}, [isSupported, isListening, initializeSpeechRecognition, handleError]);

	const stopTranscription = React.useCallback(() => {
		if (recognitionRef.current) {
			recognitionRef.current.stop();
			recognitionRef.current = null;
		}

		setIsListening(false);
		setCurrentTranscript("");
	}, []);

	const clearTranscripts = React.useCallback(() => {
		setFinalTranscripts([]);
		setCurrentTranscript("");
	}, []);

	// Cleanup on unmount
	React.useEffect(() => {
		return () => {
			if (recognitionRef.current) {
				recognitionRef.current.stop();
				recognitionRef.current = null;
			}
		};
	}, []);

	// Auto-restart recognition if it stops unexpectedly (when continuous is true)
	React.useEffect(() => {
		if (continuous && isListening && recognitionRef.current) {
			const recognition = recognitionRef.current;

			const handleEnd = () => {
				// Only restart if we're still supposed to be listening
				if (isListening && !transcriptionError) {
					setTimeout(() => {
						if (isListening && recognitionRef.current === recognition) {
							try {
								recognition.start();
							} catch (error) {
								console.error(
									"❌ Failed to restart speech recognition:",
									error,
								);

								handleError(error as Error);
							}
						}
					}, 100);
				}
			};

			recognition.addEventListener("end", handleEnd);

			return () => {
				recognition.removeEventListener("end", handleEnd);
			};
		}
	}, [continuous, isListening, transcriptionError, handleError]);

	return {
		// Speech recognition state
		isSupported,
		isListening,
		transcriptionError,
		currentTranscript,
		finalTranscripts,

		// Controls
		startTranscription,
		stopTranscription,
		clearTranscripts,
	};
};
