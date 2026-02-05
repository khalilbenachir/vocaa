import { colors } from "@/theme/colors";

export interface CategoryResult {
  category: string;
  iconName: string;
  iconColor: string;
  iconBackgroundColor: string;
  iconBorderColor: string;
  confidence: number;
}

interface CategoryDefinition {
  keywords: string[];
  iconName: string;
  colors: {
    iconColor: string;
    iconBackgroundColor: string;
    iconBorderColor: string;
  };
}

const CATEGORIES: Record<string, CategoryDefinition> = {
  meeting: {
    keywords: [
      "meeting",
      "standup",
      "sync",
      "call",
      "conference",
      "agenda",
      "attendees",
      "minutes",
      "discuss",
      "huddle",
    ],
    iconName: "calendar-clock",
    colors: {
      iconColor: colors.purple,
      iconBackgroundColor: colors.purpleLighter,
      iconBorderColor: colors.purpleLight,
    },
  },
  idea: {
    keywords: [
      "idea",
      "brainstorm",
      "think",
      "concept",
      "imagine",
      "what if",
      "creative",
      "innovation",
      "thought",
      "inspiration",
    ],
    iconName: "lightbulb-outline",
    colors: {
      iconColor: colors.yellow,
      iconBackgroundColor: colors.yellowLighter,
      iconBorderColor: colors.yellowLight,
    },
  },
  shopping: {
    keywords: [
      "buy",
      "shop",
      "grocery",
      "groceries",
      "list",
      "store",
      "purchase",
      "order",
      "amazon",
      "price",
      "cart",
    ],
    iconName: "cart-outline",
    colors: {
      iconColor: colors.teal,
      iconBackgroundColor: colors.tealLighter,
      iconBorderColor: colors.tealLight,
    },
  },
  task: {
    keywords: [
      "todo",
      "task",
      "remind",
      "reminder",
      "remember",
      "don't forget",
      "need to",
      "have to",
      "deadline",
      "due",
    ],
    iconName: "checkbox-marked-outline",
    colors: {
      iconColor: colors.orange,
      iconBackgroundColor: colors.orangeLighter,
      iconBorderColor: colors.orangeLight,
    },
  },
  health: {
    keywords: [
      "doctor",
      "health",
      "medicine",
      "appointment",
      "exercise",
      "workout",
      "gym",
      "run",
      "diet",
      "symptoms",
      "medical",
    ],
    iconName: "heart-pulse",
    colors: {
      iconColor: colors.red,
      iconBackgroundColor: colors.redLighter,
      iconBorderColor: colors.redLight,
    },
  },
  travel: {
    keywords: [
      "travel",
      "trip",
      "flight",
      "hotel",
      "vacation",
      "book",
      "itinerary",
      "passport",
      "airport",
      "destination",
    ],
    iconName: "airplane",
    colors: {
      iconColor: colors.blue,
      iconBackgroundColor: colors.blueLighter,
      iconBorderColor: colors.blueLight,
    },
  },
  finance: {
    keywords: [
      "money",
      "budget",
      "expense",
      "pay",
      "invoice",
      "account",
      "bank",
      "investment",
      "salary",
      "savings",
      "cost",
    ],
    iconName: "cash-multiple",
    colors: {
      iconColor: colors.green,
      iconBackgroundColor: colors.greenLighter,
      iconBorderColor: colors.greenLight,
    },
  },
  learning: {
    keywords: [
      "learn",
      "study",
      "course",
      "book",
      "read",
      "class",
      "lecture",
      "tutorial",
      "practice",
      "education",
      "school",
    ],
    iconName: "school-outline",
    colors: {
      iconColor: colors.deepPurple,
      iconBackgroundColor: colors.deepPurpleLighter,
      iconBorderColor: colors.deepPurpleLight,
    },
  },
  work: {
    keywords: [
      "project",
      "client",
      "deadline",
      "report",
      "presentation",
      "email",
      "boss",
      "colleague",
      "office",
      "review",
    ],
    iconName: "briefcase-outline",
    colors: {
      iconColor: colors.indigo,
      iconBackgroundColor: colors.indigoLighter,
      iconBorderColor: colors.indigoLight,
    },
  },
  personal: {
    keywords: [
      "journal",
      "diary",
      "thoughts",
      "feelings",
      "reflection",
      "personal",
      "life",
      "grateful",
      "mood",
      "myself",
    ],
    iconName: "account-heart-outline",
    colors: {
      iconColor: colors.pink,
      iconBackgroundColor: colors.pinkLighter,
      iconBorderColor: colors.pinkLight,
    },
  },
  food: {
    keywords: [
      "recipe",
      "cook",
      "dinner",
      "lunch",
      "breakfast",
      "restaurant",
      "food",
      "meal",
      "ingredient",
      "ingredients",
      "eat",
    ],
    iconName: "food-outline",
    colors: {
      iconColor: colors.amber,
      iconBackgroundColor: colors.amberLighter,
      iconBorderColor: colors.amberLight,
    },
  },
};

const COLOR_PALETTE = [
  {
    iconColor: colors.purple,
    iconBackgroundColor: colors.purpleLighter,
    iconBorderColor: colors.purpleLight,
  },
  {
    iconColor: colors.orange,
    iconBackgroundColor: colors.orangeLighter,
    iconBorderColor: colors.orangeLight,
  },
  {
    iconColor: colors.blue,
    iconBackgroundColor: colors.blueLighter,
    iconBorderColor: colors.blueLight,
  },
  {
    iconColor: colors.brown,
    iconBackgroundColor: colors.brownLighter,
    iconBorderColor: colors.brownLight,
  },
  {
    iconColor: colors.green,
    iconBackgroundColor: colors.greenLighter,
    iconBorderColor: colors.greenLight,
  },
  {
    iconColor: colors.cyan,
    iconBackgroundColor: colors.cyanLighter,
    iconBorderColor: colors.cyanLight,
  },
  {
    iconColor: colors.pink,
    iconBackgroundColor: colors.pinkLighter,
    iconBorderColor: colors.pinkLight,
  },
  {
    iconColor: colors.teal,
    iconBackgroundColor: colors.tealLighter,
    iconBorderColor: colors.tealLight,
  },
  {
    iconColor: colors.yellow,
    iconBackgroundColor: colors.yellowLighter,
    iconBorderColor: colors.yellowLight,
  },
  {
    iconColor: colors.lime,
    iconBackgroundColor: colors.limeLighter,
    iconBorderColor: colors.limeLight,
  },
  {
    iconColor: colors.deepPurple,
    iconBackgroundColor: colors.deepPurpleLighter,
    iconBorderColor: colors.deepPurpleLight,
  },
  {
    iconColor: colors.amber,
    iconBackgroundColor: colors.amberLighter,
    iconBorderColor: colors.amberLight,
  },
];

function getDefaultCategory(): CategoryResult {
  const colorIndex = Math.floor(Math.random() * COLOR_PALETTE.length);
  const colorSet = COLOR_PALETTE[colorIndex];

  return {
    category: "default",
    iconName: "microphone",
    ...colorSet,
    confidence: 0,
  };
}

export const CategoryDetectionService = {
  detectCategory(transcript: string): CategoryResult {
    if (!transcript || transcript.length < 10) {
      return getDefaultCategory();
    }

    const normalizedText = transcript.toLowerCase();

    let bestMatch: { category: string; score: number } | null = null;

    for (const [categoryName, definition] of Object.entries(CATEGORIES)) {
      let matchCount = 0;

      for (const keyword of definition.keywords) {
        if (keyword.includes(" ")) {
          // Phrase match (multi-word keywords like "what if", "don't forget")
          if (normalizedText.includes(keyword)) {
            matchCount += 2; // Phrase matches weighted higher
          }
        } else {
          // Single word - check word boundaries
          const regex = new RegExp(`\\b${keyword}\\b`, "i");
          if (regex.test(normalizedText)) {
            matchCount += 1;
          }
        }
      }

      if (matchCount > 0 && (!bestMatch || matchCount > bestMatch.score)) {
        bestMatch = { category: categoryName, score: matchCount };
      }
    }

    // Require at least 1 match to assign a category
    if (bestMatch && bestMatch.score >= 1) {
      const category = CATEGORIES[bestMatch.category];
      return {
        category: bestMatch.category,
        iconName: category.iconName,
        ...category.colors,
        confidence: Math.min(bestMatch.score / 5, 1),
      };
    }

    return getDefaultCategory();
  },
};
