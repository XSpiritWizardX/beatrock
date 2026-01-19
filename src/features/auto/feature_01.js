export const moduleName = "auto_feature_11";
export const revision = 11;

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
