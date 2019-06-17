import fs from 'fs-extra';
import proc from 'child_process';
import path from 'path';
import indent from 'identify-indent';
import notifier, { Package } from 'update-notifier';
import pEvent from 'p-event';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { cli } from 'cli-ux';
import { performance } from 'perf_hooks';
import { Command, flags as Flags } from '@oclif/command';
import { IConfig } from '@oclif/config';
import Parser from '@oclif/parser';
const pkg: Package = require(path.join(__dirname, '../package.json'));

class NowInitSvelte extends Command {
  static readonly description: string = 'Initialize now.sh for svelte and sapper';

  static readonly flags = {
    help: Flags.help(),
    version: Flags.version(),
  };

  constructor(argv: string[], config: IConfig) {
    super(argv, config);
  }

  static readonly args: Parser.args.IArg[] = [
    {
      name: 'type',
      options: ['svelte', 'sapper'],
      description: 'Type to generate. Must be Svelte or Sapper.',
    },
    {
      name: 'name',
      default: path.basename(process.cwd()),
      description: 'Name of the project, defaults to current directory name',
    },
  ];

  get opts(): fs.WriteOptions {
    let result: indent.Result | null = null;
    try {
      result = indent.file('./package.json');
    } catch (err) {
      this.warn(chalk.yellow(err.toString()));
    }
    let spaces: string | number;
    if (result == null) {
      this.warn(chalk.yellow('Could not get indentation'));
      spaces = 4;
    } else {
      spaces = result.character == '\t' ? '\t' : result.size;
    }
    return { spaces };
  }

  async ask(): Promise<string> {
    return (await inquirer.prompt<{ type: 'Svelte' | 'Sapper' }>([
      {
        type: 'list',
        name: 'type',
        message: 'Select type',
        choices: ['Svelte', 'Sapper'],
      },
    ])).type.toLowerCase();
  }

  addScript(json: any): any {
    if (json.scripts == undefined) {
      json.scripts = {};
    }
    json.scripts['now-build'] = 'rollup -c';
    return json;
  }

  nowGen(Type: string, name: string): any {
    if (Type == 'svelte') {
      return {
        version: 2,
        name: name,
        builds: [
          {
            src: 'package.json',
            use: '@now/static-build',
            config: { distDir: 'public' },
          },
        ],
      };
    } else if (Type == 'sapper') {
      return {
        version: 2,
        name: name,
        builds: [
          {
            src: '__sapper__/build/index.js',
            use: 'now-sapper',
          },
        ],
        routes: [{ src: '/(.*)', dest: '__sapper__/build/index.js' }],
      };
    }
  }

  ignoreGen(Type: string): string {
    if (Type == 'svelte') {
      return 'node_modules\npublic/bundle.*\n';
    } else if (Type == 'sapper') {
      return '__sapper__/dev\n__sapper__/export\ncypress\nnode_modules\nsrc\n';
    }
    return '';
  }

  server(data: Buffer): string {
    const array = data
      .toString('utf-8')
      .replace(/.listen/, '\nexport default app.handler\n\nif (!process.env.NOW_REGION) app.listen')
      .split('\n');

    array.forEach((v, i) => {
      if (v.startsWith('polka()')) array[i] = 'const app = polka()';
    });
    return array.join('\n');
  }

  rollup(data: Buffer): string {
    let array = data
      .toString('utf-8')
      .replace(/pkg.dependencies/g, '{}')
      .split('\n');

    let hasJson = false;
    array.forEach((v, i) => {
      if (v == "import pkg from './package.json';") {
        array[i] = "// import pkg from './package.json';";
      } else if (v == "import json from 'rollup-plugin-json';") {
        hasJson = true;
      }
    });

    if (!hasJson) {
      array.unshift("import json from 'rollup-plugin-json';");
      array = array
        .join('\n')
        .replace(/svelte\(\{/g, 'json(), svelte({')
        .split('\n');
    }
    return array.join('\n');
  }

  async run() {
    notifier({ pkg }).notify({ defer: true, isGlobal: true });
    const { args } = this.parse(NowInitSvelte, process.argv);

    if (await fs.pathExists('./now.json')) {
      this.error(chalk.red('You have already initialized now here'));
      this.exit(1);
    }
    if (!(await fs.pathExists('./package.json'))) {
      this.error(chalk.red('No package.json found. Make sure you are running this in the root of your project'));
      this.exit(1);
    }
    const projType: string = args.type != undefined ? args.type : await this.ask();
    if (projType == 'svelte') {
      const options = this.opts;

      process.stdout.write(chalk.blue('Writing files... '));

      await fs.writeJson('./package.json', this.addScript(await fs.readJson('./package.json')), options);
      await fs.writeFile('.nowignore', this.ignoreGen('svelte'));
      await fs.writeJson('./now.json', this.nowGen('svelte', args.name), options);

      console.log(chalk.green('Done'));
    } else if (projType == 'sapper') {
      cli.action.start(chalk.blue('Installing dependencies'));
      const startTime = performance.now();
      const p = proc.spawn('npm', ['install', '--save-dev', 'rollup-plugin-json'], {
        env: Object.create(process.env),
        stdio: 'inherit',
      });

      // p.stdout.on("data", data => console.error(data.toString("utf-8")));
      // p.stderr.on("data", data => console.error(data.toString("utf-8")));
      const code: number = await pEvent(p, 'close');
      const endTime = performance.now();

      if (code != 0) {
        cli.action.stop(chalk.red('\n\n ✘ npm errored'));
        this.error(chalk.red(`\n\n npm exited with status '${code}', check logs for errors`));
        this.exit(code);
      }

      cli.action.stop(chalk.green(`\n\n ✔ Done in ${Math.floor(endTime - startTime)}ms`));

      process.stdout.write(chalk.blue('\nWriting files... '));

      await fs.writeFile('./src/server.js', await this.server(await fs.readFile('./src/server.js')));
      await fs.writeFile('./rollup.config.js', await this.rollup(await fs.readFile('./rollup.config.js')));
      await fs.writeFile('./.nowignore', this.ignoreGen('sapper'));
      await fs.writeJson('./now.json', this.nowGen('sapper', args.name), this.opts);

      console.log(chalk.green('Done'));
    } else {
      this.error(chalk.red("Type must be 'svelte' or 'sapper'"));
      this.exit(1);
    }
  }
}

export = NowInitSvelte;
