const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        ws: false,
        fs: false,
        net: false,
      };
    }

    return config;
  },
};

module.exports = nextConfig;
