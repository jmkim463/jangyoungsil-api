
import * as types from "node:util/types";
import { ConsoleLogger, Logger } from "@nestjs/common";
import * as util from "node:util";
import { InspectOptions } from "util";

export class BasicLogger extends ConsoleLogger {

  constructor(private readonly className?: string) {
    super();
  }

  private inspectionOption = {
    showHidden: false,
    depth: null,
    colors: true
  }

  private getContext() {
    const timestamp = new Date().toISOString();
    return `${this.className}`;
  }

  private getMessage(args): string {
    const result = args.map(item => {
      if (typeof item === 'object') {
        return util.inspect(item, this.inspectionOption);
      }
      return item;
    }).join(' ');
    return result;
  }

  log(...args) {
    super.log(this.getMessage(args), this.getContext());
  }

  warn(...args) {
    super.warn(this.getMessage(args), this.getContext());
  }

  error(...args) {
    super.error(this.getMessage(args), this.getContext());
  }

  debug(...args) {
    super.debug(this.getMessage(args), this.getContext());
  }

  verbose(...args) {
    super.verbose(this.getMessage(args), this.getContext());
  }
}