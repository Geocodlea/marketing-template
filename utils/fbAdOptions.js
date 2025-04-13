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

const campaignObjectives = [
  "OUTCOME_LEADS",
  "OUTCOME_SALES",
  "OUTCOME_ENGAGEMENT",
  "OUTCOME_AWARENESS",
  "OUTCOME_TRAFFIC",
  "OUTCOME_APP_PROMOTION",
];

const campaignStatuses = ["ACTIVE", "PAUSED", "DELETED", "ARCHIVED"];

const adSetBillingEvents = [
  "APP_INSTALLS",
  "CLICKS",
  "IMPRESSIONS",
  "LINK_CLICKS",
  "NONE",
  "OFFER_CLAIMS",
  "PAGE_LIKES",
  "POST_ENGAGEMENT",
  "THRUPLAY",
  "PURCHASE",
  "LISTING_INTERACTION",
];

const adSetOptimizationGoals = [
  "APP_INSTALLS",
  "AD_RECALL_LIFT",
  "ENGAGED_USERS",
  "EVENT_RESPONSES",
  "IMPRESSIONS",
  "LEAD_GENERATION",
  "QUALITY_LEAD",
  "LINK_CLICKS",
  "OFFSITE_CONVERSIONS",
  "PAGE_LIKES",
  "POST_ENGAGEMENT",
  "QUALITY_CALL",
  "REACH",
  "LANDING_PAGE_VIEWS",
  "VISIT_INSTAGRAM_PROFILE",
  "VALUE",
  "THRUPLAY",
  "DERIVED_EVENTS",
  "APP_INSTALLS_AND_OFFSITE_CONVERSIONS",
  "CONVERSATIONS",
  "IN_APP_VALUE",
  "MESSAGING_PURCHASE_CONVERSION",
  "SUBSCRIBERS",
  "REMINDERS_SET",
  "MEANINGFUL_CALL_ATTEMPT",
  "PROFILE_VISIT",
  "PROFILE_AND_PAGE_ENGAGEMENT",
  "ADVERTISER_SILOED_VALUE",
  "MESSAGING_APPOINTMENT_CONVERSION",
];

const adSetBidStrategies = [
  "LOWEST_COST_WITHOUT_CAP",
  "LOWEST_COST_WITH_BID_CAP",
  "COST_CAP",
  "LOWEST_COST_WITH_MIN_ROAS",
];

const adCreativeCTAs = [
  "BOOK_TRAVEL",
  "CONTACT_US",
  "DONATE",
  "DONATE_NOW",
  "DOWNLOAD",
  "GET_DIRECTIONS",
  "GO_LIVE",
  "INTERESTED",
  "LEARN_MORE",
  "LIKE_PAGE",
  "MESSAGE_PAGE",
  "RAISE_MONEY",
  "SAVE",
  "SEND_TIP",
  "SHOP_NOW",
  "SIGN_UP",
  "VIEW_INSTAGRAM_PROFILE",
  "INSTAGRAM_MESSAGE",
  "LOYALTY_LEARN_MORE",
  "PURCHASE_GIFT_CARDS",
  "PAY_TO_ACCESS",
  "SEE_MORE",
  "TRY_IN_CAMERA",
  "WHATSAPP_LINK",
  "GET_IN_TOUCH",
  "BOOK_NOW",
  "CHECK_AVAILABILITY",
  "ORDER_NOW",
  "WHATSAPP_MESSAGE",
  "GET_MOBILE_APP",
  "INSTALL_MOBILE_APP",
  "USE_MOBILE_APP",
  "INSTALL_APP",
  "USE_APP",
  "PLAY_GAME",
  "WATCH_VIDEO",
  "WATCH_MORE",
  "OPEN_LINK",
  "NO_BUTTON",
  "LISTEN_MUSIC",
  "MOBILE_DOWNLOAD",
  "GET_OFFER",
  "GET_OFFER_VIEW",
  "BUY_NOW",
  "BUY_TICKETS",
  "UPDATE_APP",
  "BET_NOW",
  "ADD_TO_CART",
  "SELL_NOW",
  "GET_SHOWTIMES",
  "LISTEN_NOW",
  "GET_EVENT_TICKETS",
  "REMIND_ME",
  "SEARCH_MORE",
  "PRE_REGISTER",
  "SWIPE_UP_PRODUCT",
  "SWIPE_UP_SHOP",
  "PLAY_GAME_ON_FACEBOOK",
  "VISIT_WORLD",
  "OPEN_INSTANT_APP",
  "JOIN_GROUP",
  "GET_PROMOTIONS",
  "SEND_UPDATES",
  "INQUIRE_NOW",
  "VISIT_PROFILE",
  "CHAT_ON_WHATSAPP",
  "EXPLORE_MORE",
  "CONFIRM",
  "JOIN_CHANNEL",
  "MAKE_AN_APPOINTMENT",
  "ASK_ABOUT_SERVICES",
  "BOOK_A_CONSULTATION",
  "GET_A_QUOTE",
  "BUY_VIA_MESSAGE",
  "ASK_FOR_MORE_INFO",
  "CHAT_WITH_US",
  "VIEW_PRODUCT",
  "VIEW_CHANNEL",
  "WATCH_LIVE_VIDEO",
  "CALL",
  "MISSED_CALL",
  "CALL_NOW",
  "CALL_ME",
  "APPLY_NOW",
  "BUY",
  "GET_QUOTE",
  "SUBSCRIBE",
  "RECORD_NOW",
  "VOTE_NOW",
  "GIVE_FREE_RIDES",
  "REGISTER_NOW",
  "OPEN_MESSENGER_EXT",
  "EVENT_RSVP",
  "CIVIC_ACTION",
  "SEND_INVITES",
  "REFER_FRIENDS",
  "REQUEST_TIME",
  "SEE_MENU",
  "SEARCH",
  "TRY_IT",
  "TRY_ON",
  "LINK_CARD",
  "DIAL_CODE",
  "FIND_YOUR_GROUPS",
  "START_ORDER",
];

export {
  initialAdDetails,
  findEmptyFields,
  campaignObjectives,
  campaignStatuses,
  adSetBillingEvents,
  adSetOptimizationGoals,
  adSetBidStrategies,
  adCreativeCTAs,
};
