# SentinelCLI

A real-time frontend-only satellite tracking CLI powered by CelesTrak TLE data and SGP4 propagation. Built to provide live orbital monitoring, pass predictions, and satellite querying directly from the terminal.

---

# What is it?

This project is a CLI-based satellite monitoring system that allows users to:

* Query satellite TLE data from CelesTrak
* Track satellites in real time using SGP4 propagation
* Predict passes for observer locations
* Run continuous live monitoring sessions
* Interact through a custom command-line interface with a parser + lexer system

---

# Tech Stack

## Core

* SvelteKit – UI + app structure
* TypeScript – type safety and shared logic
* JS Workers - Asynchronous task management
* satellite.js – SGP4 orbital propagation
* CelesTrak API – satellite TLE data source

---

# Features

## CLI System

* Full terminal-like interface
* Color-coded output system:
  * input (user commands)
  * output (computed results)
  * info (system status)
  * warning / alert / success / debug / notification, etc.
* Thread abstraction ontop of js workers.
* Command history tracking

---

## Command System

Lexer + parser-based command execution with support for:

* quoted strings ("" and '')
* flags (`--live`, `--json`)
* key-value args (`--limit 10`)

---

## Core Commands

### General

* `help` – show help.
* `clear` – clear terminal.
* `cleanup` - removes threads with status Done or Error.
* `kill` - removes and terminates a specific thread by id.
* `threads` - displays the current threads, showing id, status, and age.
* `watch` - gathers the data for a given group or NORAD id.
* `track` - tracks a given NORAD id for a satellite in real time using SGP4.
* `nearby` - displays all satellites that will enter a given lat/lon location given a radius and timewindow.

# Design Decisions

## Architecture

* CLI-first design instead of UI-first
* Parser-driven execution model (lexing + AST-like structure)
* Modular command registry system
* Asynchronous command execution using custom thread abstraction and managing.

---

## Data Handling

* CelesTrak used as primary satellite data source
* SGP4 used for all orbital propagation
* Caching all data in memory and persistent on localStorage using a custom cacheManager

---

## UI / Terminal Design

### Color Scheme

* Background: `#161719`
* Highlight: `#35393C`
* Selected: `#161719`

### Output Types

* input → user command
* info → system messages
* output → computed results
* success → completed actions
* warning → non-fatal issues
* alert → errors
* debug → dev-only logs
* notification → passive updates

### Font

* Droid Sans Mono

---

## Theme Palette (base)

```json
{
  "color": [
    "#282a2e",
    "#a54242",
    "#8c9440",
    "#de935f",
    "#5f819d",
    "#85678f",
    "#5e8d87",
    "#707880",
    "#373b41",
    "#cc6666",
    "#b5bd68",
    "#f0c674",
    "#81a2be",
    "#b294bb",
    "#8abeb7",
    "#c5c8c6"
  ],
  "foreground": "#c5c8c6",
  "background": "#1d1f21",
  "blackHighlight": "#161719"
}
```
