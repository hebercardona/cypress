#!/usr/bin/env bash

branchname=$(git describe --contains --all HEAD)
featureBranch='feature'
pat='(HEC-[0-9]+)'
[[ $branchname =~ $pat ]] # get Jira ticket ID from branch name

if [[ "$branchname" == *"$featureBranch"* ]];
then
    testFolder="cypress/integration/${BASH_REMATCH[0]}/**/*.spec.js"
else
    testFolder="cypress/integration/**/*.spec.js"
fi
BRANCH_NAME="${BASH_REMATCH[0]}"  npx cypress run  --spec "${testFolder}"
