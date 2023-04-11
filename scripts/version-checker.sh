#!/bin/bash

is_auto=false

# Check source code have node package
if [ -f "package.json" ]; then
  # Install package
  npm ci

  echo "=========================Node package version check========================="

  # Check dependencies package is in latest version
  for package in $(jq -r '.dependencies | keys | .[]' package.json); do
    installed_version=$(jq -r ".dependencies[\"$package\"]" package.json)

    if [[ "$installed_version" == *"^"* || "$installed_version" == *"~"* || "$installed_version" == *"*"* ]]; then
      echo -e "\e[31mWarning: $package will update automatic to the latest version\e[0m"
      is_auto=true
    fi
  done

  # Check dev dependencies package is in latest version
  for package in $(jq -r '.devDependencies | keys | .[]' package.json); do
    installed_version=$(jq -r ".devDependencies[\"$package\"]" package.json)

    if [[ "$installed_version" == *"^"* || "$installed_version" == *"~"* || "$installed_version" == *"*"* ]]; then
      echo -e "\e[31mWarning: $package will update automatic to the latest version\e[0m"
      is_auto=true
    fi
  done
fi

if [ $is_auto = true ]; then
  exit 1
fi
