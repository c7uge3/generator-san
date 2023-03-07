const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");

module.exports = class extends Generator {
  async prompting() {
    this.log(
      yosay(
        `Welcome to the scrumtrulescent ${chalk.red(
          "generator-san"
        )} generator!`
      )
    );

    const prompts = [
      {
        type: "input",
        name: "name",
        message: "What is your project name?",
        default: this.appname,
      },
      { type: "input", name: "description", message: "Enter a description:" },
      { type: "input", name: "author", message: "Enter author name:" },
      {
        type: "confirm",
        name: "typescript",
        message: "Would you like to enable TypeScript?",
        default: false,
      },
      {
        type: "confirm",
        name: "less",
        message: "Would you like to enable Less?",
        default: false,
      },
      {
        type: "confirm",
        name: "redux",
        message: "Would you like to enable Redux?",
        default: false,
      },
      {
        type: "confirm",
        name: "eslint",
        message: "Would you like to enable ESLint?",
        default: false,
      },
      {
        type: "confirm",
        name: "jest",
        message: "Would you like to enable Jest?",
        default: false,
      },
    ];

    this.answers = await this.prompt(prompts);
  }

  writing() {
    const pkgJson = {
      name: this.appname,
      version: "0.1.0",
      scripts: {
        start: "vite",
        build: "vite build",
        serve: "vite preview",
        test: "jest",
      },
      dependencies: {
        react: "^17.0.2",
        "react-dom": "^17.0.2",
        axios: "^0.21.1",
      },
      devDependencies: {
        vite: "^4.1.4",
      },
    };

    if (this.answers.typescript) {
      pkgJson.devDependencies = {
        ...pkgJson.devDependencies,
        "@vitejs/plugin-react": "^1.0.0",
        "@types/react": "^17.0.8",
        "@types/react-dom": "^17.0.5",
        typescript: "^4.3.5",
      };
    } else {
      pkgJson.devDependencies = {
        ...pkgJson.devDependencies,
        "@vitejs/plugin-react": "3.1.0",
      };
    }

    if (this.answers.less) {
      pkgJson.devDependencies = {
        ...pkgJson.devDependencies,
        less: "^4.1.1",
        "less-loader": "^8.0.0",
      };
    }

    if (this.answers.eslint) {
      pkgJson.devDependencies = {
        ...pkgJson.devDependencies,
        eslint: "^7.32.0",
        "eslint-plugin-react": "^7.26.1",
        "eslint-plugin-react-hooks": "^4.2.0",
      };
    }

    if (this.answers.redux) {
      pkgJson.dependencies = {
        ...pkgJson.dependencies,
        redux: "^4.1.1",
        "react-redux": "^7.2.4",
      };
    }

    if (this.answers.jest) {
      pkgJson.devDependencies = {
        ...pkgJson.devDependencies,
        jest: "^27.0.6",
        "babel-jest": "^27.0.6",
        "@testing-library/react": "^12.0.0",
        "@testing-library/jest-dom": "^5.14.1",
      };
    }

    this.fs.extendJSON(this.destinationPath("package.json"), pkgJson);

    this.fs.copyTpl(
      this.templatePath("index.html"),
      this.destinationPath("index.html")
    );

    this.fs.copyTpl(
      this.templatePath("App.js"),
      this.destinationPath("src/App.js")
    );

    if (this.answers.redux) {
      this.fs.copyTpl(
        this.templatePath("store.js"),
        this.destinationPath("src/store.js")
      );
    }

    if (this.answers.typescript) {
      this.fs.copyTpl(
        this.templatePath("index.tsx"),
        this.destinationPath("src/index.tsx")
      );
    } else {
      this.fs.copyTpl(
        this.templatePath("index.jsx"),
        this.destinationPath("src/index.jsx")
      );
    }

    if (this.answers.less) {
      this.fs.copyTpl(
        this.templatePath("App.less"),
        this.destinationPath("src/App.less")
      );
    }

    if (this.answers.eslint) {
      this.fs.copyTpl(
        this.templatePath(".eslintrc.json"),
        this.destinationPath(".eslintrc.json")
      );
    }

    if (this.answers.jest) {
      this.fs.copyTpl(
        this.templatePath("App.test.js"),
        this.destinationPath("src/App.test.js")
      );
    }
  }

  install() {
    const dependencies = ["react", "react-dom", "axios"];
    const devDependencies = ["vite"];

    if (this.answers.typescript) {
      dependencies.push("@types/react", "@types/react-dom");
      devDependencies.push("@vitejs/plugin-react", "typescript");
    } else {
      devDependencies.push("@vitejs/plugin-react");
    }

    if (this.answers.less) {
      devDependencies.push("less", "less-loader");
    }

    if (this.answers.eslint) {
      devDependencies.push(
        "eslint",
        "eslint-plugin-react",
        "eslint-plugin-react-hooks"
      );
    }

    if (this.answers.redux) {
      dependencies.push("redux", "react-redux");
    }

    if (this.answers.jest) {
      devDependencies.push(
        "jest",
        "babel-jest",
        "@testing-library/react",
        "@testing-library/jest-dom"
      );
    }

    this.npmInstall(dependencies, { "save-dev": false });
    this.npmInstall(devDependencies, { "save-dev": true });
  }
};
