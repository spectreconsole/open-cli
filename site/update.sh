#!/bin/bash

# Copy the draft into the spec template file and put the result
# in the ./.artifacts directory
BEGIN_GEN=$(cat docs/spec.template | grep -n '### BEGIN GENERATED CONTENT' | sed 's/\(.*\):.*/\1/g')
END_GEN=$(cat docs/spec.template | grep -n '### END GENERATED CONTENT' | sed 's/\(.*\):.*/\1/g')
cat <(head -n $(expr $BEGIN_GEN - 1) docs/spec.template) ../draft.md <(tail -n +$(expr $END_GEN + 1) docs/spec.template) > ../.artifacts/spec.md

# Replace invalid markdown characters
sed -i -e 's/</\\</g' ../.artifacts/spec.md
sed -i -e 's/>/\\>/g' ../.artifacts/spec.md

# Copy the artifact to the site
mv ../.artifacts/spec.md docs/spec.md