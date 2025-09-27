import "dotenv/config";

const config = {
  expo: {
    name: "mapa-de-acessibilidade",
    slug: "mapa-de-acessibilidade",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "mapadeacessibilidade",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,

    ios: {
      supportsTablet: true,
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    },

    android: {
      package: "com.luizamantovani.mapadeacessibilidade",
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
    },

    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },

    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/UPX4_lockscreen.png", // caminho da sua splash
          resizeMode: "cover", // "cover" para preencher a tela inteira
          backgroundColor: "#ffffff",
        },
      ],
    ],

    experiments: {
      typedRoutes: true,
    },

    extra: {
      router: {},
      eas: {
        projectId: "f4d92aef-e419-40f0-97ab-f89eed30d4ee",
      },
    },

    owner: "luizamantovani",
  },
};

export default config;
