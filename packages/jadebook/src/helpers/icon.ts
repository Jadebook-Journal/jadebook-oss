import * as PhosphorIcons from "@phosphor-icons/react";

/**
 * These are the text color classnames for the icons — specifically for the text color
 */
export const ICON_TEXT_COLOR_CLASSNAMES = {
  primary: "text-foreground",
  slate: "text-slate-600",
  gray: "text-gray-600",
  zinc: "text-zinc-600",
  neutral: "text-neutral-600",
  red: "text-red-600",
  orange: "text-orange-600",
  amber: "text-amber-600",
  yellow: "text-yellow-600",
  lime: "text-lime-600",
  green: "text-green-600",
  emerald: "text-emerald-600",
  teal: "text-teal-600",
  cyan: "text-cyan-600",
  sky: "text-sky-600",
  blue: "text-blue-600",
  indigo: "text-indigo-600",
  violet: "text-violet-600",
  purple: "text-purple-600",
  fuchsia: "text-fuchsia-600",
  pink: "text-pink-600",
  rose: "text-rose-600",
  white: "text-white",
  black: "text-black",
} as const;

/**
 * Phosphor may change the icon names, so we proxy the keys to the actual icon names. This
 * let's us provide a fallback if a icon gets removed.
 */
export const ICON_PHOSPHOR_KEYS: Record<string, keyof typeof PhosphorIcons> = {
  acorn: "Acorn",
  address_book: "AddressBook",
  airplane: "Airplane",
  airplane_tilt: "AirplaneTilt",
  alarm: "Alarm",
  alien: "Alien",
  anchor: "Anchor",
  android_logo: "AndroidLogo",
  apple_logo: "AppleLogo",
  archive: "Archive",
  armchair: "Armchair",
  at: "At",
  atom: "Atom",
  avocado: "Avocado",
  axe: "Axe",
  baby: "Baby",
  bag: "Bag",
  balloon: "Balloon",
  bank: "Bank",
  barbell: "Barbell",
  barcode: "Barcode",
  baseball: "Baseball",
  basket: "Basket",
  basketball: "Basketball",
  beach_ball: "BeachBall",
  bed: "Bed",
  beer_bottle: "BeerBottle",
  bell: "Bell",
  binary: "Binary",
  biohazard: "Biohazard",
  bird: "Bird",
  boat: "Boat",
  bone: "Bone",
  book: "Book",
  bookmark: "BookmarkSimple",
  brackets_angle: "BracketsAngle",
  brackets_square: "BracketsSquare",
  brackets_round: "BracketsRound",
  brackets_curly: "BracketsCurly",
  brain: "Brain",
  brandy: "Brandy",
  bug: "Bug",
  butterfly: "Butterfly",
  cake: "Cake",
  calendar: "Calendar",
  camera: "Camera",
  campfire: "Campfire",
  car: "CarSimple",
  carrot: "Carrot",
  chat_teardrop: "ChatTeardrop",
  check: "Check",
  circle: "Circle",
  circleDashed: "CircleDashed",
  circlesThree: "CirclesThree",
  clock: "Clock",
  cloud: "Cloud",
  clover: "Clover",
  club: "Club",
  code: "Code",
  coffee: "Coffee",
  coin: "Coin",
  compass: "Compass",
  confetti: "Confetti",
  cookie: "Cookie",
  cookingPot: "CookingPot",
  copy: "Copy",
  copyright: "Copyright",
  cpu: "Cpu",
  cross: "Cross",
  crown: "Crown",
  cube: "Cube",
  currencyDollar: "CurrencyDollar",
  cursor: "Cursor",
  diamond: "Diamond",
  dna: "Dna",
  dog: "Dog",
  drop: "Drop",
  envelope_simple: "EnvelopeSimple",
  eye: "Eye",
  fire: "Fire",
  first_aid: "FirstAid",
  fish: "Fish",
  file: "File",
  flag: "Flag",
  flask: "Flask",
  flower_lotus: "FlowerLotus",
  folder: "Folder",
  globe: "Globe",
  globe_hemisphere_east: "GlobeHemisphereEast",
  globe_hemisphere_west: "GlobeHemisphereWest",
  hands_praying: "HandsPraying",
  hand_peace: "HandPeace",
  hash: "Hash",
  heart: "Heart",
  heart_break: "HeartBreak",
  hexagon: "Hexagon",
  highlighter: "Highlighter",
  hourglass: "Hourglass",
  house: "House",
  image: "Image",
  infinity: "Infinity",
  info: "Info",
  island: "Island",
  leaf: "Leaf",
  lightbulb: "Lightbulb",
  lightning: "Lightning",
  linux: "LinuxLogo",
  lock: "Lock",
  magnifying_glass: "MagnifyingGlass",
  map_pin: "MapPin",
  moon: "Moon",
  moon_stars: "MoonStars",
  music_notes: "MusicNotes",
  notches: "Notches",
  octagon: "Octagon",
  package: "Package",
  pencil_simple: "PencilSimple",
  pentagon: "Pentagon",
  planet: "Planet",
  plus: "Plus",
  plus_circle: "PlusCircle",
  prohibit: "Prohibit",
  push_pin_simple: "PushPinSimple",
  question: "Question",
  question_mark: "QuestionMark",
  quotes: "Quotes",
  radioactive: "Radioactive",
  recycle: "Recycle",
  robot: "Robot",
  rocket_launch: "RocketLaunch",
  seal: "Seal",
  seal_check: "SealCheck",
  seal_percent: "SealPercent",
  seal_question: "SealQuestion",
  seal_warning: "SealWarning",
  smiley: "Smiley",
  smiley_angry: "SmileyAngry",
  smiley_meh: "SmileyMeh",
  smiley_sad: "SmileySad",
  smiley_blank: "SmileyBlank",
  smiley_wink: "SmileyWink",
  smiley_melting: "SmileyMelting",
  smiley_nervous: "SmileyNervous",
  smiley_x_eyes: "SmileyXEyes",
  snowflake: "Snowflake",
  spade: "Spade",
  sparkle: "Sparkle",
  spiral: "Spiral",
  square: "Square",
  star: "Star",
  star_four: "StarFour",
  star_of_david: "StarOfDavid",
  sun: "Sun",
  tag: "Tag",
  tag_chevron: "TagChevron",
  tag_simple: "TagSimple",
  terminal: "Terminal",
  text_aa: "TextAa",
  text_t: "TextT",
  thumbs_down: "ThumbsDown",
  thumbs_up: "ThumbsUp",
  trash: "Trash",
  triangle: "Triangle",
  trophy: "Trophy",
  user: "User",
  users: "Users",
  users_three: "UsersThree",
  waves: "Waves",
  x: "X",
  x_circle: "XCircle",
  yin_yang: "YinYang",
} as const;

/**
 * These are the weights that Phosphor supports. We use this to validate the weight
 * of the icon. Using 'as const' and proper typing to preserve enum types.
 */
export const PHOSPHOR_ICON_WEIGHTS_ARRAY = [
  "thin",
  "light",
  "regular",
  "bold",
  "fill",
  "duotone",
] as const satisfies readonly PhosphorIcons.IconWeight[];

// Export the proper weight type
export type PhosphorIconWeight = (typeof PHOSPHOR_ICON_WEIGHTS_ARRAY)[number];

export type IconStringProps = {
  key: keyof typeof ICON_PHOSPHOR_KEYS;
  weight: PhosphorIconWeight;
  color?: keyof typeof ICON_TEXT_COLOR_CLASSNAMES;
};

/**
 * Generates a string representation of an icon. This is used to generate the icon string
 * for the icon component for storing the icon in the database.
 *
 * @param key - The key of the icon
 * @param weight - The weight of the icon
 * @param color - The color of the icon
 * @returns The string representation of the icon [ key:weight:color ]
 */
export function generateIconString(props: IconStringProps) {
  const data: string[] = [props.key, props.weight];

  if (props.color) {
    data.push(props.color);
  }

  return data.join(":");
}

/**
 * Parses a string representation of an icon and returns the icon props.
 *
 * @param value - The string representation of the icon [ key:weight:color ]
 * @returns The icon props or null if the icon is not valid
 */
export function getIcon(value: string): IconStringProps | null {
  const [key, second] = value.split(/:(.+)/);
  const [weight, color] = second.split(/:(.+)/);

  if (
    !Object.keys(ICON_PHOSPHOR_KEYS).includes(key) ||
    typeof weight !== "string" ||
    weight === "" ||
    !PHOSPHOR_ICON_WEIGHTS_ARRAY.includes(weight as PhosphorIconWeight)
  ) {
    return null;
  }

  return {
    key: key as keyof typeof ICON_PHOSPHOR_KEYS,
    weight: weight as PhosphorIconWeight,
    color: color as keyof typeof ICON_TEXT_COLOR_CLASSNAMES,
  };
}

export type ParsedIconProps =
  | {
      key: null;
      Icon: null;
      weight: null;
      color: null;
    }
  | {
      key: keyof typeof ICON_PHOSPHOR_KEYS;
      Icon: PhosphorIcons.Icon;
      weight: PhosphorIconWeight;
      color: keyof typeof ICON_TEXT_COLOR_CLASSNAMES;
    };

/**
 * Parses a string representation of an icon and returns the icon props and the icon component.
 *
 * @param value - The string representation of the icon [ key:weight:color ]
 * @returns The icon props plus the icon component or null if the icon is not valid.
 */
export function getParsedIcon(
  value: string | null | undefined
): ParsedIconProps {
  if (!value || typeof value !== "string") {
    return { key: null, Icon: null, weight: null, color: null };
  }

  const icon = getIcon(value);

  if (!icon) {
    return { key: null, Icon: null, weight: null, color: null };
  }

  const iconKey = ICON_PHOSPHOR_KEYS[icon.key] as keyof typeof PhosphorIcons;
  const Icon = PhosphorIcons[iconKey] as PhosphorIcons.Icon;

  return {
    key: icon.key,
    Icon,
    weight: icon.weight,
    color: icon.color ?? "primary",
  };
}
