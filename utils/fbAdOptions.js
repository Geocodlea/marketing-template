const initialAdDetails = {
  campaign: {
    name: null,
    objective: "OUTCOME_LEADS",
    status: null,
  },
  adSet: {
    name: null,
    billingEvent: "IMPRESSIONS",
    optimizationGoal: "LEAD_GENERATION",
    bidStrategy: "LOWEST_COST_WITHOUT_CAP",
    dailyBudget: null,
    targeting: {
      geoLocations: {
        countries: ["RO"],
      },
    },
  },
  leadForm: {
    name: null,
    locale: "ro_RO",
    privacy_policy: {
      url: "https://marketing-template-xi.vercel.app/privacy-policy",
      link_text: "Politica de confidențialitate",
    },
    intro: {
      title: null,
      body: null,
    },
    questions: [
      { type: "FULL_NAME" },
      { type: "PHONE" },
      {
        type: "CUSTOM",
        label: null,
      },
    ],
    thank_you_page: {
      title: null,
      body: null,
      button_text: null,
      button_type: null,
      website_url: null,
    },
  },
  adCreative: {
    name: null,
    objectStorySpec: {
      linkData: {
        message: null,
        link: null,
        picture: null,
        CTA: {
          type: null,
          value: {
            link: null,
          },
        },
      },
    },
  },
};

function findEmptyFields(obj, path = [], excludePaths = []) {
  const emptyFields = [];

  const isEmpty = (val) =>
    val === null ||
    val === undefined ||
    val === "" ||
    (Array.isArray(val) && val.length === 0);

  const currentPath = path.join(".");

  // Check if the current path should be excluded
  if (excludePaths.includes(currentPath)) {
    return [];
  }

  if (isEmpty(obj)) {
    return [currentPath];
  }

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      emptyFields.push(
        ...findEmptyFields(item, [...path, `[${index}]`], excludePaths)
      );
    });
  } else if (typeof obj === "object" && obj !== null) {
    Object.entries(obj).forEach(([key, value]) => {
      emptyFields.push(...findEmptyFields(value, [...path, key], excludePaths));
    });
  }

  return emptyFields;
}

const campaignObjectives = ["OUTCOME_LEADS"];

const campaignStatuses = ["ACTIVE", "PAUSED", "DELETED", "ARCHIVED"];

const adSetBillingEvents = [
  "CLICKS",
  "IMPRESSIONS",
  "POST_ENGAGEMENT",
  "THRUPLAY",
];

const adSetOptimizationGoals = ["LEAD_GENERATION"];

const adSetBidStrategies = ["LOWEST_COST_WITHOUT_CAP"];

const leadFormCTAs = [
  "VIEW_WEBSITE",
  "CALL_BUSINESS",
  "MESSAGE_BUSINESS",
  "DOWNLOAD",
  "SCHEDULE_APPOINTMENT",
  "VIEW_ON_FACEBOOK",
  "PROMO_CODE",
  "NONE",
  "WHATSAPP",
  "P2B_MESSENGER",
];

const adCreativeCTAs = [
  "CONTACT_US",
  "INTERESTED",
  "LEARN_MORE",
  "SIGN_UP",
  "SEE_MORE",
  "GET_IN_TOUCH",
  "BOOK_NOW",
  "CHECK_AVAILABILITY",
  "GET_OFFER",
  "INQUIRE_NOW",
  "APPLY_NOW",
  "GET_QUOTE",
  "REGISTER_NOW",
];

export {
  initialAdDetails,
  findEmptyFields,
  campaignObjectives,
  campaignStatuses,
  adSetBillingEvents,
  adSetOptimizationGoals,
  adSetBidStrategies,
  leadFormCTAs,
  adCreativeCTAs,
};
