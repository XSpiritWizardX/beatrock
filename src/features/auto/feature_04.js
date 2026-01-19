export const moduleName = "auto_feature_24";
export const revision = 24;

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
