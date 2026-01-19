export const moduleName = "auto_feature_20";
export const revision = 20;

export const featureBrief = {
  title: "beatrock",
  summary: "A focused product module.",
  checkpoints: [
    "Define success metric",
    "Ship first user flow",
    "Instrument activation funnel",
  ],
};

export const getNextAction = () =>
  featureBrief.checkpoints[0] || "Ship the MVP";
