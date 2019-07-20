module.exports = {
    "verbose": true,
    "testMatch": [
        "<rootDir>/tests/**/*.tests.ts",
    ],
    "testPathIgnorePatterns": [
        "/node_modules/"
    ],
    "moduleFileExtensions": [
        "js",
        "ts",
    ],
    "transform": {
        "\\.ts$": "ts-jest"
    }
};