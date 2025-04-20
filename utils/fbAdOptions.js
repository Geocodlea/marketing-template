const initialAdDetails = {
  campaign: {
    name: null,
    status: null,
  },
  adSet: {
    name: null,
    daily_budget: null,
    targeting: {
      geo_locations: {
        countries: ["RO"],
      },
    },
  },
  leadForm: {
    name: null,
    intro: {
      title: null,
      body: null,
    },
    questions: [
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
    object_story_spec: {
      link_data: {
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
