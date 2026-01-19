export const moduleName = "feature_flags";

export const featureFlags = {
  onboardingRevamp: true,
  pricingExperiment: false,
  retentionAlerts: true,
  growthPlaybooks: false,
};

export const isFeatureEnabled = key => Boolean(featureFlags[key]);

export const listEnabledFeatures = () =>
  Object.keys(featureFlags).filter(key => featureFlags[key]);

export const featureSummary = "Feature Flags";
