export interface Category {
  id: string;
  name: string;
  count: number;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  count: number;
}

export interface AppScreenshot {
  id: string;
  title: string;
  imageUrl: string;
  categoryId: string;
}

export const categories: Category[] = [
  {
    id: "flow-tree",
    name: "Flow Tree",
    count: 0,
    subcategories: [],
  },
  {
    id: "onboarding",
    name: "Onboarding",
    count: 12,
    subcategories: [],
  },
  {
    id: "home",
    name: "Home",
    count: 3,
    subcategories: [],
  },
  {
    id: "starting-fundraiser",
    name: "Starting a fundraiser",
    count: 23,
    subcategories: [
      {
        id: "adding-cover-photo",
        name: "Adding a cover photo",
        count: 3,
      },
      {
        id: "enhancing-story-ai",
        name: "Enhancing story using AI",
        count: 3,
      },
    ],
  },
  {
    id: "copying-link",
    name: "Copying a link",
    count: 3,
    subcategories: [],
  },
  {
    id: "edit-fundraiser",
    name: "Edit fundraiser",
    count: 3,
    subcategories: [
      {
        id: "editing-fundraiser",
        name: "Editing a fundraiser",
        count: 4,
      },
      {
        id: "deleting-fundraiser",
        name: "Deleting a fundraiser",
        count: 4,
      },
    ],
  },
  {
    id: "select-fundraiser",
    name: "Select fundraiser",
    count: 2,
    subcategories: [],
  },
  {
    id: "donations",
    name: "Donations",
    count: 4,
    subcategories: [
      {
        id: "making-donation-anonymous",
        name: "Making a donation anonymous",
        count: 3,
      },
    ],
  },
];

export const appScreenshots: AppScreenshot[] = [
  // Onboarding screenshots
  {
    id: "1",
    title: "GoFundMe Splash Screen",
    imageUrl: "https://images.unsplash.com/photo-1751535076133-716cb28df027?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    categoryId: "onboarding",
  },
  {
    id: "2",
    title: "Welcome Screen",
    imageUrl: "https://picsum.photos/300/600?random=2",
    categoryId: "onboarding",
  },
  {
    id: "3",
    title: "Sign Up Flow",
    imageUrl: "https://picsum.photos/300/600?random=3",
    categoryId: "onboarding",
  },
  {
    id: "4",
    title: "Login Screen",
    imageUrl: "https://picsum.photos/300/600?random=4",
    categoryId: "onboarding",
  },
  {
    id: "5",
    title: "Account Setup",
    imageUrl: "https://picsum.photos/300/600?random=5",
    categoryId: "onboarding",
  },
  {
    id: "6",
    title: "Tutorial Step 1",
    imageUrl: "https://picsum.photos/300/600?random=6",
    categoryId: "onboarding",
  },
  {
    id: "7",
    title: "Tutorial Step 2",
    imageUrl: "https://picsum.photos/300/600?random=7",
    categoryId: "onboarding",
  },
  {
    id: "8",
    title: "Tutorial Step 3",
    imageUrl: "https://picsum.photos/300/600?random=8",
    categoryId: "onboarding",
  },
  {
    id: "9",
    title: "Permissions Request",
    imageUrl: "https://picsum.photos/300/600?random=9",
    categoryId: "onboarding",
  },
  {
    id: "10",
    title: "Setup Complete",
    imageUrl: "https://picsum.photos/300/600?random=10",
    categoryId: "onboarding",
  },
  {
    id: "11",
    title: "Getting Started",
    imageUrl: "https://picsum.photos/300/600?random=11",
    categoryId: "onboarding",
  },
  {
    id: "12",
    title: "First Time Experience",
    imageUrl: "https://picsum.photos/300/600?random=12",
    categoryId: "onboarding",
  },

  // Home screenshots
  {
    id: "13",
    title: "Home Dashboard",
    imageUrl: "https://picsum.photos/300/600?random=13",
    categoryId: "home",
  },
  {
    id: "14",
    title: "Feed View",
    imageUrl: "https://picsum.photos/300/600?random=14",
    categoryId: "home",
  },
  {
    id: "15",
    title: "Navigation Menu",
    imageUrl: "https://picsum.photos/300/600?random=15",
    categoryId: "home",
  },

  // Starting fundraiser screenshots
  {
    id: "16",
    title: "Create Fundraiser",
    imageUrl: "https://picsum.photos/300/600?random=16",
    categoryId: "starting-fundraiser",
  },
  {
    id: "17",
    title: "Campaign Details",
    imageUrl: "https://picsum.photos/300/600?random=17",
    categoryId: "starting-fundraiser",
  },
  {
    id: "18",
    title: "Choose Category",
    imageUrl: "https://picsum.photos/300/600?random=18",
    categoryId: "starting-fundraiser",
  },

  // Adding cover photo subcategory
  {
    id: "19",
    title: "Photo Gallery",
    imageUrl: "https://picsum.photos/300/600?random=19",
    categoryId: "adding-cover-photo",
  },
  {
    id: "20",
    title: "Photo Editor",
    imageUrl: "https://picsum.photos/300/600?random=20",
    categoryId: "adding-cover-photo",
  },
  {
    id: "21",
    title: "Crop & Adjust",
    imageUrl: "https://picsum.photos/300/600?random=21",
    categoryId: "adding-cover-photo",
  },

  // Enhancing story using AI subcategory
  {
    id: "22",
    title: "AI Story Assistant",
    imageUrl: "https://picsum.photos/300/600?random=22",
    categoryId: "enhancing-story-ai",
  },
  {
    id: "23",
    title: "Story Templates",
    imageUrl: "https://picsum.photos/300/600?random=23",
    categoryId: "enhancing-story-ai",
  },
  {
    id: "24",
    title: "AI Suggestions",
    imageUrl: "https://picsum.photos/300/600?random=24",
    categoryId: "enhancing-story-ai",
  },

  // Copying link screenshots
  {
    id: "25",
    title: "Share Options",
    imageUrl: "https://picsum.photos/300/600?random=25",
    categoryId: "copying-link",
  },
  {
    id: "26",
    title: "Copy Link Dialog",
    imageUrl: "https://picsum.photos/300/600?random=26",
    categoryId: "copying-link",
  },
  {
    id: "27",
    title: "Share Success",
    imageUrl: "https://picsum.photos/300/600?random=27",
    categoryId: "copying-link",
  },

  // Donations screenshots
  {
    id: "28",
    title: "Donation Form",
    imageUrl: "https://picsum.photos/300/600?random=28",
    categoryId: "donations",
  },
  {
    id: "29",
    title: "Payment Options",
    imageUrl: "https://picsum.photos/300/600?random=29",
    categoryId: "donations",
  },
  {
    id: "30",
    title: "Donation Complete",
    imageUrl: "https://picsum.photos/300/600?random=30",
    categoryId: "donations",
  },
  {
    id: "31",
    title: "Receipt View",
    imageUrl: "https://picsum.photos/300/600?random=31",
    categoryId: "donations",
  },
];

export const getScreenshotsByCategory = (categoryId: string): AppScreenshot[] => {
  // If it's a main category, return its direct screenshots plus subcategory screenshots
  const category = categories.find((cat) => cat.id === categoryId);
  if (category) {
    const directScreenshots = appScreenshots.filter((screenshot) => screenshot.categoryId === categoryId);
    const subcategoryScreenshots = category.subcategories?.flatMap((sub) => appScreenshots.filter((screenshot) => screenshot.categoryId === sub.id)) || [];
    return [...directScreenshots, ...subcategoryScreenshots];
  }

  // If it's a subcategory, return only its screenshots
  return appScreenshots.filter((screenshot) => screenshot.categoryId === categoryId);
};
