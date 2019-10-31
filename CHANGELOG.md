# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.6] - 2019-10-31
### Added
Collison resoluton for multiple level of skills
### Fixed
Collisions found in dialog_nodes for Skills Re-merged multiple times.

### Removed
- Redundant searchNodeByTitle functionality.
- Redundant deleteNode feature.
- Character Bug in version 0.1.5 in assistantSkillsMerger.js

## [0.1.5] - 2019-10-30
This version is known to cause RunTime error due to accident character 'A' left on line 48 in assistantSkillsMerger.js
### Added
- Conflicts resolution for intents CAP/LOWER Case
- Conflicts resolution for entities CAP/LOWER Case
- Merging using the last Element from one skill
- Compatibility for Different Watson Assistant Plans

### Changed
- Start using "changelog" over "change log" since it's the common usage.
- Start versioning based on the current English version at 0.3.0 to help

### Removed
- Merging using "Anything else Node"

### Fixed
- Fix typos in recent README changes.