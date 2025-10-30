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
      API_URL: process.env.API_URL,
      "eas": {
        "projectId": "a2f0dede-4448-4e57-a411-4e687f043229"
      }
    },
  },
};

export default config;
