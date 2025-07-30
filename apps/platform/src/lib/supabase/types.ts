export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
	public: {
		Tables: {
			asset: {
				Row: {
					created_at: string;
					entity_id: string;
					entity_type: string;
					file_name: string;
					id: string;
					mime_type: string;
					path: string;
					size: number;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					entity_id: string;
					entity_type: string;
					file_name: string;
					id?: string;
					mime_type: string;
					path: string;
					size: number;
					user_id?: string;
				};
				Update: {
					created_at?: string;
					entity_id?: string;
					entity_type?: string;
					file_name?: string;
					id?: string;
					mime_type?: string;
					path?: string;
					size?: number;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "asset_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "user";
						referencedColumns: ["id"];
					},
				];
			};
			entry: {
				Row: {
					character_count: number;
					content: string | null;
					cover: string | null;
					created_at: string;
					entry_date: string;
					excerpt: string | null;
					icon: string | null;
					id: string;
					pinned: boolean;
					tags: string[];
					title: string;
					type: string;
					updated_at: string;
					user_id: string;
				};
				Insert: {
					character_count?: number;
					content?: string | null;
					cover?: string | null;
					created_at?: string;
					entry_date?: string;
					excerpt?: string | null;
					icon?: string | null;
					id?: string;
					pinned?: boolean;
					tags?: string[];
					title?: string;
					type?: string;
					updated_at?: string;
					user_id?: string;
				};
				Update: {
					character_count?: number;
					content?: string | null;
					cover?: string | null;
					created_at?: string;
					entry_date?: string;
					excerpt?: string | null;
					icon?: string | null;
					id?: string;
					pinned?: boolean;
					tags?: string[];
					title?: string;
					type?: string;
					updated_at?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "entry_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "user";
						referencedColumns: ["id"];
					},
				];
			};
			export: {
				Row: {
					created_at: string;
					end_date: string;
					expire_at: string;
					id: string;
					start_date: string;
					type: string;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					end_date: string;
					expire_at: string;
					id?: string;
					start_date: string;
					type?: string;
					user_id?: string;
				};
				Update: {
					created_at?: string;
					end_date?: string;
					expire_at?: string;
					id?: string;
					start_date?: string;
					type?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "export_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "user";
						referencedColumns: ["id"];
					},
				];
			};
			goal: {
				Row: {
					cover: string | null;
					created_at: string;
					description: string | null;
					end_date: string;
					icon: string | null;
					id: string;
					pinned: boolean;
					state: string;
					tags: string[];
					title: string;
					updated_at: string;
					user_id: string;
				};
				Insert: {
					cover?: string | null;
					created_at?: string;
					description?: string | null;
					end_date: string;
					icon?: string | null;
					id?: string;
					pinned?: boolean;
					state?: string;
					tags?: string[];
					title: string;
					updated_at?: string;
					user_id?: string;
				};
				Update: {
					cover?: string | null;
					created_at?: string;
					description?: string | null;
					end_date?: string;
					icon?: string | null;
					id?: string;
					pinned?: boolean;
					state?: string;
					tags?: string[];
					title?: string;
					updated_at?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "goal_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "user";
						referencedColumns: ["id"];
					},
				];
			};
			log: {
				Row: {
					content: string | null;
					created_at: string;
					goal_id: string;
					id: string;
					type: string | null;
					updated_at: string;
					user_id: string;
				};
				Insert: {
					content?: string | null;
					created_at?: string;
					goal_id: string;
					id?: string;
					type?: string | null;
					updated_at?: string;
					user_id?: string;
				};
				Update: {
					content?: string | null;
					created_at?: string;
					goal_id?: string;
					id?: string;
					type?: string | null;
					updated_at?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "log_goal_id_fkey";
						columns: ["goal_id"];
						isOneToOne: false;
						referencedRelation: "goal";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "log_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "user";
						referencedColumns: ["id"];
					},
				];
			};
			tag: {
				Row: {
					color: string;
					cover: string | null;
					created_at: string;
					icon: string;
					id: string;
					label: string;
					pinned: boolean;
					updated_at: string;
					user_id: string;
					variant: string;
				};
				Insert: {
					color: string;
					cover?: string | null;
					created_at?: string;
					icon: string;
					id?: string;
					label: string;
					pinned?: boolean;
					updated_at?: string;
					user_id?: string;
					variant: string;
				};
				Update: {
					color?: string;
					cover?: string | null;
					created_at?: string;
					icon?: string;
					id?: string;
					label?: string;
					pinned?: boolean;
					updated_at?: string;
					user_id?: string;
					variant?: string;
				};
				Relationships: [
					{
						foreignKeyName: "tag_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "user";
						referencedColumns: ["id"];
					},
				];
			};
			user: {
				Row: {
					config: string | null;
					created_at: string;
					current_streak: number;
					id: string;
					last_entry_date: string | null;
					longest_streak: number;
					profile_image: string | null;
					theme: string | null;
					updated_at: string;
					username: string | null;
				};
				Insert: {
					config?: string | null;
					created_at?: string;
					current_streak?: number;
					id?: string;
					last_entry_date?: string | null;
					longest_streak?: number;
					profile_image?: string | null;
					theme?: string | null;
					updated_at?: string;
					username?: string | null;
				};
				Update: {
					config?: string | null;
					created_at?: string;
					current_streak?: number;
					id?: string;
					last_entry_date?: string | null;
					longest_streak?: number;
					profile_image?: string | null;
					theme?: string | null;
					updated_at?: string;
					username?: string | null;
				};
				Relationships: [];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
	keyof Database,
	"public"
>];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
				DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
			DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
				DefaultSchema["Views"])
		? (DefaultSchema["Tables"] &
				DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends
		| keyof DefaultSchema["Enums"]
		| { schema: keyof DatabaseWithoutInternals },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
		: never = never,
> = DefaultSchemaEnumNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
		? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema["CompositeTypes"]
		| { schema: keyof DatabaseWithoutInternals },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never = never,
> = PublicCompositeTypeNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
		? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
		: never;

export const Constants = {
	public: {
		Enums: {},
	},
} as const;
