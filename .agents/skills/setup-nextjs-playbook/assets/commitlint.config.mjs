/** @type {import("@commitlint/types").UserConfig} */
const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Scopes are optional and free-form, but must be lower-case kebab-case so
    // that "registration" and "Registrations" cannot both appear in history.
    "scope-case": [2, "always", "kebab-case"],
  },
};

export default config;
