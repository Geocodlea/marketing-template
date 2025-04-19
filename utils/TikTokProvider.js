export default function TikTokProvider(options) {
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
        client_key: options.clientId,
        scope: "user.info.basic",
        response_type: "code",
      },
    },

    token: {
      async request(context) {
        const body = new URLSearchParams({
          client_key: context.provider.clientId,
          client_secret: context.provider.clientSecret,
          code: context.params.code,
          grant_type: "authorization_code",
          redirect_uri: context.provider.callbackUrl,
        });

        const res = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body,
        });

        const data = await res.json();

        return {
          tokens: {
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            token_type: data.token_type,
            expires_at: data.expires_in,
          },
        };
      },
    },

    userinfo: {
      async request(context) {
        const res = await fetch(
          "https://open.tiktokapis.com/v2/user/info/?fields=open_id,avatar_url,display_name",
          {
            headers: {
              Authorization: `Bearer ${context.tokens.access_token}`,
            },
          }
        );

        const data = await res.json();
        return data;
      },
    },

    profile(profile) {
      return {
        id: profile.data.user.open_id,
        name: profile.data.user.display_name,
        image: profile.data.user.avatar_url,
        email: null,
      };
    },

    options,
  };
}
