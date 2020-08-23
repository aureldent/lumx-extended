import withThemeProvider from "./withThemeProvider";

export const globalTypes = {
  globalTheme: {
    name: "Global Theme",
    description: "Global theme for components",
    defaultValue: "lumapps",
    toolbar: {
      icon: "circlehollow",
      // array of plain string values or MenuItem shape (see below)
      items: ["lumapps", "material"],
    },
  },
};

export const decorators = [withThemeProvider];

export const parameters = {
  options: {
    showRoots: true,
  },
  // automatically create action args for all props that start with "on"
  actions: { argTypesRegex: "^on.*" },
  controls: { expanded: true },
};
