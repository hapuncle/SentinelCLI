import type { CommandHandler } from "../CommandRegistry";
import type { CommandContext } from "../types";

//   ____             _   _            _    ____ _     ___ 
//  / ___|  ___ _ __ | |_(_)_ __   ___| |  / ___| |   |_ _|
//  \___ \ / _ \ '_ \| __| | '_ \ / _ \ | | |   | |    | | 
//   ___) |  __/ | | | |_| | | | |  __/ | | |___| |___ | | 
//  |____/ \___|_| |_|\__|_|_| |_|\___|_|  \____|_____|___|
//
//  (c) Harmen Achterhuis. Sentinel CLI version 0.0.1. All rights reserved.

const banner = `
   ____             _   _            _    ____ _     ___ 
  / ___|  ___ _ __ | |_(_)_ __   ___| |  / ___| |   |_ _|
  \\___ \\ / _ \\ '_ \\| __| | '_ \\ / _ \\ | | |   | |    | | 
   ___) |  __/ | | | |_| | | | |  __/ | | |___| |___ | | 
  |____/ \\___|_| |_|\\__|_|_| |_|\\___|_|  \\____|_____|___|

  (c) Harmen Achterhuis. All rights reserved. [Version 0.0.1]
`;

const bannerLines = banner.split('\n');

export const creditsCommand: CommandHandler = {
    name: "credits",
    description: "Shows credits",
    syntax: "credits",
    execute: (_, context: CommandContext) => {
        for (const line of bannerLines) {
            context.pushToHistory(`${line}`, "highlight");
        };
    }
};