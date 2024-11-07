#!/bin/bash

# fix this path to use for local testing new stuff and sync with your installation
export DESTINATION_ROOT="/mnt/c/Users/MY_USER/AppData/Roaming/SpaceEngineers/Mods"

mkdir -p "$DESTINATION_ROOT/ewe-core-minerals"
mkdir -p "$DESTINATION_ROOT/ewe-planets"
mkdir -p "$DESTINATION_ROOT/ewe-core-components"
mkdir -p "$DESTINATION_ROOT/ewe-components"
mkdir -p "$DESTINATION_ROOT/ewe-enhanced"


rsync -ac ./core-minerals/ "$DESTINATION_ROOT/ewe-core-minerals/" --delete
rsync -ac ./core-components/ "$DESTINATION_ROOT/ewe-core-components/" --delete
rsync -ac ./planets/ "$DESTINATION_ROOT/ewe-planets/" --delete
rsync -ac ./components/ "$DESTINATION_ROOT/ewe-components/" --delete
rsync -ac ./enhanced/ "$DESTINATION_ROOT/ewe-enhanced/" --delete


mkdir -p "$DESTINATION_ROOT/ewe-plugin-stargate"
rsync -ac ./plugin-stargate/ "$DESTINATION_ROOT/ewe-plugin-stargate/" --delete
