export default function TikTokProvider(options) {
  console.log("🚀 ~ tikTokProvider.js:2 ~ TikTokProvider ~ options:", options);
  return {
    id: "tiktok",
    name: "TikTok",
    type: "oauth",
    client: {
      token_endpoint_auth_method: "client_secret_post",
    },
    authorization: {
      url: "https://www.tiktok.com/v2/auth/authorize/",
      params: {
        scope: "user.info.basic",
      },
    },

    getAuthorizationUrl({ provider, options }) {
      console.log(
        "🚀 ~ tikTokProvider.js:18 ~ getAuthorizationUrl ~ options:",
        options
      );
      console.log(
        "🚀 ~ tikTokProvider.js:18 ~ getAuthorizationUrl ~ provider:",
        provider
      );
      const params = new URLSearchParams({
        client_key: process.env.TIKTOK_CLIENT_ID, // Use clientId value as client_key
        scope: provider.authorization.params.scope,
        response_type: "code",
        redirect_uri: provider.callbackUrl, // Use callbackUrl provided by NextAuth
        state: options.state, // Include state for security
      });
      return `${provider.authorization.url}?${params.toString()}`;
    },

    token: {
      async request(context) {
        console.log("🚀 ~ tikTokProvider.js:19 ~ request ~ context:", context);

        const res = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            client_key: context.provider.clientId,
            client_secret: context.provider.clientSecret,
            code: context.params.code,
            grant_type: "authorization_code",
            redirect_uri: context.provider.callbackUrl,
          }),
        });

        const data = await res.json();
        console.log("🔐 TikTok token response:", data);

        if (!data.access_token) {
          throw new Error("No access_token returned by TikTok");
        }

        return {
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          token_type: data.token_type,
          scope: data.scope,
          expires_in: data.expires_in,
          refresh_expires_in: data.refresh_expires_in,
          open_id: data.open_id,
        };
      },
    },

    userinfo: {
      async request({ tokens }) {
        console.log("🚀 ~ tikTokProvider.js:54 ~ request ~ tokens:", tokens);
        console.log("✅ TikTok access token:", tokens.access_token);

        const res = await fetch(
          "https://open.tiktokapis.com/v2/user/info/?fields=open_id,avatar_url,display_name",
          {
            headers: {
              Authorization: `Bearer ${tokens.access_token}`,
            },
          }
        );

        const data = await res.json();
        console.log("📦 TikTok userinfo response:", data);
        return data;
      },
    },

    profile(profile) {
      return {
        id: profile.data.user.open_id,
        name: profile.data.user.display_name,
        image: profile.data.user.avatar_url,
        // Email address is not supported by TikTok.
        email: null,
      };
    },

    // clientId: process.env.TIKTOK_CLIENT_ID,
    // clientSecret: process.env.TIKTOK_CLIENT_SECRET,
    ...options,
  };
}
